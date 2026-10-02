const fs = require('fs');
const path = require('path');
const { buildESM, getModuleFolderForFile } = require('./build.esm.js');
const esbuild = require('esbuild');
const rollup = require('./node_modules/rollup');
const rollup_config = require('./rollup.config.js');

// Load config.json dynamically
const configPath = path.resolve(__dirname, 'build.config.json');
const build_config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// load settings
const resourcesPath = path.resolve(__dirname, build_config.resourcesPath);
const entryFilePath = path.join(resourcesPath, build_config.entryFilePath);
const backupDir = path.join(__dirname, build_config.backupDir);
const scriptOrder = build_config.scriptOrder;
const moduleFolders = build_config.moduleFolders;
const excludeFiles = build_config.excludeFiles;

// Short banner comment prepended to every generated JS/CSS output file (per-component minified
// files, the classic single-file bundle, and the bundled CSS). Configured centrally here so it
// only ever needs to change in one place. See the header-injection notes on minifyJS below for
// why this can't just be esbuild's own `banner` option for the per-component JS case.
const copyrightHeader = build_config.copyrightHeader
    || '/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */';

// Removes every existing copy of the shared header from some content (esbuild and Rollup both
// preserve /*! ... */ comments automatically when bundling/minifying, so content that has
// already passed through one stage, or is being concatenated from several files that each
// already carry their own copy, can easily end up with more than one). Always pair this with
// ensureSingleHeader() below rather than a plain prepend, so the result is correct regardless
// of how many copies (zero, one, or several) were already present going in.
function stripHeader(content)
{
    return content.split(copyrightHeader).join('');
}

function ensureSingleHeader(content)
{
    return copyrightHeader + '\n' + stripHeader(content).replace(/^\s+/, '');
}

const esmOutputPath = path.resolve(resourcesPath, build_config.esmOutputPath || 'ESM');

// Unminified bundle output always happens (mandatory baseline, same idea as components always
// getting a .min.js companion generated regardless of any flag). --minify additionally builds
// the minified bundle variant on top of that - it no longer selects which single variant to
// produce, both flag states share the same unminified pass, --minify just adds the second one.
const buildMinifiedBundle = process.argv.includes('--minify') ? true : build_config.isMinify;

// Where the classic single-file bundle (UI.js/UI.min.js + ui.css/.min.css) gets
// written. Defaults to the ESM output folder itself, since that's the "script only publishing
// folder" - nothing in the .NET embedded-resource / lazy-load path reads these bundled files,
// only npm/script-tag consumers of the published package do. Add to build.config.json to
// override, e.g. "bundledOutputPath": "Base/Script" to restore the old location.
const bundledOutputPath = path.resolve(resourcesPath, build_config.bundledOutputPath || build_config.esmOutputPath || 'ESM');

fs.mkdirSync(bundledOutputPath, { recursive: true });

// Unminified output always regenerates this run; the minified variant only regenerates when
// buildMinifiedBundle is set (see main() below). Delete both variants of both bundle types
// up front regardless, so a stale minified file from a PREVIOUS --minify run never lingers
// and gets mistaken for current output on a run that didn't ask for it.
['UI.js', 'UI.min.js', 'ui.css', 'ui.min.css'].forEach(name =>
{
    const filePath = path.join(bundledOutputPath, name);

    if (fs.existsSync(filePath))
    {
        fs.unlinkSync(filePath);
        console.log(`${name} deleted`);
    }
});

// Ensure backup directory exists
if (fs.existsSync(backupDir))
{
    fs.rmSync(backupDir, { recursive: true, force: true });
}
fs.mkdirSync(backupDir);


// Collect files AFTER deletion so UI.js/UI.min.js are not included
const jsFiles = getAllFiles(resourcesPath, '.js', excludeFiles);
const cssFiles = getAllFiles(resourcesPath, '.css', excludeFiles);

async function main()
{
    // Ensure every raw (non-minified, non-entry) source file carries exactly one copy of the
    // header - both because a file might end up circulating on its own, and because Debug
    // builds embed these raw files directly into the .NET assembly as resources, bypassing the
    // rest of this pipeline entirely. ensureSingleHeader() is idempotent, so this is safe to run
    // on every single build, including files that already have it, no double-adding.
    [...jsFiles, ...cssFiles].forEach(file =>
    {
        if (file.endsWith('.min.js') || file.endsWith('.min.css') || isEntryFile(file)) return;

        const content = fs.readFileSync(file, 'utf8');
        const updated = normalizeLineEndings(ensureSingleHeader(content));

        if (updated !== content)
            fs.writeFileSync(file, updated, 'utf8');
    });

    // buildESM() wipes and recreates the entire ESM folder on every run (removeDirWithRetry),
    // and bundledOutputPath defaults to that same folder - so it MUST run before bundleJS()/
    // bundleCSS() write their output there, or its own folder-wipe would delete the bundle
    // files right after they're written. buildESM() itself never reads the bundled output
    // (it works from the original per-component source files directly), so this ordering is
    // safe regardless of which way round they run - it's only safe THIS way round.
    //
    // package.template.json (not package.json) is passed explicitly here: package.json in this
    // folder is the build tooling's own npm manifest (rollup/esbuild devDependencies), never the
    // published package's metadata - see package.template.json for that.
    if (build_config.buildESM)
        await buildESM(build_config, resourcesPath, jsFiles, cssFiles, path.resolve(__dirname, 'package.template.json'));

    // Wait for the initial minification pass to complete before bundling
    await Promise.all(jsFiles.map(minifyJS));
    await Promise.all(cssFiles.map(minifyCSS));

    // Unminified always runs; minified is additional and gated behind buildMinifiedBundle
    // below - both cases share the same unminified pass first. Sequential, not Promise.all,
    // since bundleJS mutates the shared rollup_config object and rewrites the same entry.js
    // file each call, so overlapping calls would corrupt both.
    await bundleJS(false);
    await bundleCSS(false);

    if (buildMinifiedBundle)
    {
        await bundleJS(true);
        await bundleCSS(true);

        // bundleJS(true) temporarily strips every file's dynamic imports (needed so Rollup can
        // inline everything into one bundle), re-minifies while they're stripped (needed for
        // the bundle's own input), then restores the original sources afterward. That re-minify
        // step overwrites the SAME per-component .min.js files the Promise.all(jsFiles.map
        // (minifyJS)) call above already produced correctly, with imports intact, for standalone
        // loading via $UI.getScriptResourcePath. Nothing regenerated them after the restore, so
        // they were left holding the import-stripped content meant only for the bundle. Redo it
        // now that the originals are back.
        await Promise.all(jsFiles.map(minifyJS));
    }
}


main().catch(error => console.error('Error during build:', error));

async function bundleJS(minify)
{
    const outputFile = path.join(bundledOutputPath, minify ? 'UI.min.js' : 'UI.js');

    try
    {
        // Step 1: Remove dynamic imports
        removeDynamicImports(false);

        // Step 2: Await all minification before proceeding
        if (minify)
        {
            const jsFilesToMinify = getAllFiles(resourcesPath, '.js', excludeFiles);
            await Promise.all(
                jsFilesToMinify
                    .filter(fp => !fp.endsWith('.min.js') && !fp.endsWith('entry.js'))
                    .map(fp => minifyJS(fp))
            );
        }

        // Step 3: Create entry file
        createEntryFile(minify);

        // Step 4: Bundle with Rollup
        rollup_config.input = entryFilePath;
        rollup_config.output.file = outputFile;
        rollup_config.output.inlineDynamicImports = true;
        rollup_config.output.sourcemap = minify;
        const bundle = await rollup.rollup(rollup_config);
        await bundle.write(rollup_config.output);

        // Every imported component file already carries its own header (Rollup preserves
        // comments when concatenating, it doesn't strip them), so the raw bundled output has
        // one copy per component - strip all of them and add back exactly one, at the top.
        const bundledContent = fs.readFileSync(outputFile, 'utf8');
        fs.writeFileSync(outputFile, normalizeLineEndings(ensureSingleHeader(bundledContent)), 'utf8');

        console.log(`Successfully bundled JS into: ${outputFile}`);
    }
    catch (error)
    {
        console.error('Error bundling JS files:', error);
        // Re-throw so the finally block still runs but the caller knows it failed
        throw error;
    }
    finally
    {
        // Step 5: Always restore originals
        removeDynamicImports(true);
    }
}

function getAllFiles(dir, ext, exclude = [])
{
    const excludeLower = exclude.map(e => e.toLowerCase());

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(dirent =>
    {
        const res = path.join(dir, dirent.name);

        if (dirent.isDirectory())
        {
            if (dirent.name === 'ESM') return []; // never treat ESM output as source
            return getAllFiles(res, ext, exclude);
        }

        // Was comparing a lowercased filename against an un-lowercased exclude list
        // (config has "UI.js", this compared against "ui.js") - always failed, silently.
        // A leftover UI.js/UI.min.js in Base/Script from before the bundle output moved to
        // ESM was getting swept up as if it were a real component: minified in place (the
        // mystery fresh-dated Base/Script/UI.min.js), and fed into buildESM(), which had no
        // folder for a lone file called "UI" so it fell back to creating ESM/UI/UI.js.
        return (res.endsWith(ext) && !excludeLower.includes(path.basename(res).toLowerCase())) ? res : [];
    });
}

// Writes exactly one copy of the shared header into a finished output file, regardless of
// whether esbuild already preserved a copy from the source file (it preserves /*! ... */
// comments automatically). Used by minifyJS instead of esbuild's own `banner` option - see the
// comment inside minifyJS for why.
function prependHeader(outputFile)
{
    const content = fs.readFileSync(outputFile, 'utf8');
    fs.writeFileSync(outputFile, normalizeLineEndings(ensureSingleHeader(content)), 'utf8');
}

async function minifyJS(filePath)
{
    const outputFile = filePath.replace(/\.js$/, '.min.js');
    if (filePath.endsWith('.min.js') || filePath.endsWith('entry.js')) return;

    try
    {
        await esbuild.build({
            entryPoints: [filePath],
            outfile: outputFile,
            minify: true,
            keepNames: true,
            treeShaking: false
            // Deliberately NOT using esbuild's `banner` option here. The source file already
            // carries the header (added by the backfill pass in main()), and esbuild preserves
            // /*! ... */ comments automatically, so it would already be sitting at the top of
            // this minified output before the module-detection / IIFE-wrap logic below runs -
            // and that logic decides what to do based on the content STARTING WITH specific
            // patterns ('"use strict"', '(async function', etc.), which a leading comment would
            // break. stripHeader() below removes it before that detection runs, and
            // prependHeader() adds back exactly one copy once the detection is done.
        });
    }
    catch (err)
    {
        console.error(`Error minifying: ${filePath}`, err);
        throw err;
    }

    let code = stripHeader(fs.readFileSync(outputFile, 'utf8'));
    let trimmed = code.trimStart();
    let strict = '';
    let body = trimmed;

    // ---- MODULE DETECTION ----
    if (code.includes('export default ') || code.includes('export default{'))
    {
        fs.writeFileSync(outputFile, code, 'utf8'); // write back the header-stripped version
        prependHeader(outputFile);
        return; // it's a module, do NOT wrap
    }

    // Extract "use strict" if present
    if (body.startsWith('"use strict"') || body.startsWith("'use strict'"))
    {
        const end = body.indexOf(';') + 1;
        strict = body.slice(0, end) + '\n';
        body = body.slice(end).trimStart();
    }

    // Already wrapped / async IIFE
    if (
        body.startsWith('(async function') ||
        body.startsWith('!function') ||
        body.startsWith('(function') ||
        body.startsWith('await(') ||
        body.startsWith('await (async')
    )
    {
        fs.writeFileSync(outputFile, code, 'utf8'); // write back the header-stripped version
        prependHeader(outputFile);
        return;
    }

    // ---- WRAP IF NEEDED ----
    const wrapped = `${strict}(async function(window){${body}})(window);`;
    fs.writeFileSync(outputFile, wrapped, 'utf8');
    prependHeader(outputFile);
}

async function minifyCSS(filePath)
{
    const outputFile = filePath.replace(/\.css$/, '.min.css');
    if (filePath.endsWith('.min.css')) return;

    try
    {
        await esbuild.build({
            entryPoints: [filePath],
            outfile: outputFile,
            minify: true
            // Not using esbuild's `banner` option here - the source file already carries the
            // header (added by the backfill pass in main()), and esbuild preserves /*! ... */
            // comments automatically, so a banner here would double it. prependHeader() below
            // strips whatever esbuild carried through and adds back exactly one copy.
        });
    }
    catch (err)
    {
        console.error(`Error minifying: ${filePath}`, err);
        throw err;
    }

    prependHeader(outputFile);
}

// The two possible bundle output names, always excluded when scanning for source CSS files so a
// leftover bundle from a previous run (minified or not) never gets swept into a fresh bundle.
const CSS_BUNDLE_NAMES = ['componyx-ui.css', 'componyx-ui.min.css'];

function pickCssVariant(cssPath, minify)
{
    const minPath = cssPath.replace(/\.css$/, '.min.css');
    return (minify && fs.existsSync(minPath)) ? minPath : cssPath;
}

function collectCssFilesRecursive(dir, minify)
{
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory())
            return collectCssFilesRecursive(fullPath, minify);

        if (!entry.name.endsWith('.css')) return [];
        if (entry.name.endsWith('.min.css')) return []; // reached via pickCssVariant on its non-min companion
        if (CSS_BUNDLE_NAMES.includes(entry.name)) return [];

        return [pickCssVariant(fullPath, minify)];
    }).sort((a, b) => a.localeCompare(b));
}

async function bundleCSS(minify)
{
    const outputFileName = minify ? 'ui.min.css' : 'ui.css';
    const outputPath = path.join(bundledOutputPath, outputFileName);

    const orderedFiles = [];

    // 1) everything under Base/CSS - variable definitions, resets, etc. that everything else
    //    depends on being available first
    orderedFiles.push(...collectCssFilesRecursive(path.join(resourcesPath, 'Base', 'CSS'), minify));

    // 2) every other top-level folder is treated as one component (this matches the same
    //    convention already relied on elsewhere: Button/, Form/, Bindary/, etc. are each their
    //    own top-level folder) - its own definition CSS first, then its Themes/Default.css
    const componentFolders = fs.readdirSync(resourcesPath, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && entry.name !== 'Base' && entry.name !== 'ESM')
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b));

    componentFolders.forEach(component =>
    {
        const cssDir = path.join(resourcesPath, component, 'CSS');
        if (!fs.existsSync(cssDir)) return;

        const definitionFile = pickCssVariant(path.join(cssDir, `${component}.css`), minify);
        if (fs.existsSync(definitionFile))
            orderedFiles.push(definitionFile);

        const themeFile = pickCssVariant(path.join(cssDir, 'Themes', 'Default.css'), minify);
        if (fs.existsSync(themeFile))
            orderedFiles.push(themeFile);
    });

    const combined = ensureSingleHeader(orderedFiles
        .map(file => `/* ---- ${path.relative(resourcesPath, file).replace(/\\/g, '/')} ---- */\n${stripHeader(fs.readFileSync(file, 'utf8')).trim()}`)
        .join('\n\n'));

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, normalizeLineEndings(combined), 'utf8');

    console.log(`Successfully bundled CSS into: ${outputPath} (${orderedFiles.length} files)`);
}

function removeDynamicImports(restore = false)
{
    const jsFiles = getAllFiles(resourcesPath, '.js', excludeFiles);

    function backupFile(file)
    {
        const relativePath = path.relative(resourcesPath, file);
        const backupPath = path.join(backupDir, relativePath);

        if (!fs.existsSync(backupPath))
        {
            fs.mkdirSync(path.dirname(backupPath), { recursive: true });
            const content = fs.readFileSync(file, 'utf8');
            fs.writeFileSync(backupPath, normalizeLineEndings(content), 'utf8');
            console.log(`Backed up: ${relativePath}`);
        }
    }

    function restoreFile(file)
    {
        const relativePath = path.relative(resourcesPath, file);
        const backupPath = path.join(backupDir, relativePath);

        if (fs.existsSync(backupPath))
        {
            fs.mkdirSync(path.dirname(file), { recursive: true });
            const content = fs.readFileSync(backupPath, 'utf8');
            fs.writeFileSync(file, normalizeLineEndings(content), 'utf8');
            console.log(`Restored: ${relativePath}`);
        }
    }

    jsFiles.forEach(file =>
    {
        const fileName = path.basename(file);

        if (isEntryFile(file)) return; // Skip entry files

        const isMinFile = fileName.endsWith('.min.js');

        if (restore)
        {
            // Restore any file that has a backup (including .min.js)
            restoreFile(file);
            return;
        }

        // Skip minified files on modify
        if (isMinFile) return;

        // Backup original before modifying
        backupFile(file);

        // Modify original file
        let code = fs.readFileSync(file, 'utf8');

        // Shared resolver (also used by build.esm.js): a file is a module's own entry file
        // when its filename (minus .js) matches a module name directly, wherever it physically
        // sits, and a submodule when its immediate parent folder matches a module name.
        const moduleFolder = getModuleFolderForFile(file, moduleFolders);
        const isModuleEntry = (moduleFolder && path.basename(file, '.js') === moduleFolder);

        if (!isModuleEntry)
        {
            // Remove async wrapper start
            code = code.replace(/await\s*\(\s*async\s*function\s*\(\s*\)[\s\S]*?\{\s*/, '');
            // Remove async wrapper end
            code = code.replace(/}\s*\n*\)\(\)\;\n*\s*export\s/, 'export ');
        }

        // Remove dynamic import lines
        code = code.replace(/^\s*await\s+import\(`\$\{\$UI\.+[^\)]*\)\s*.*$/gm, '');

        fs.writeFileSync(file, normalizeLineEndings(code), 'utf8');
        console.log(`Processed: ${fileName}`);
    });
}
function createEntryFile(minify)
{
    const jsFiles = getAllFiles(resourcesPath, '.js', excludeFiles);

    // Filter the files based on the minify parameter, applied to all files
    const filteredFiles = jsFiles.filter(file =>
    {
        if (minify)
        {
            return file.toLowerCase().endsWith('.min.js') && !isEntryFile(file);
        } else
        {
            return file.toLowerCase().endsWith('.js') && !file.toLowerCase().endsWith('.min.js') && !isEntryFile(file);
        }
    });

    // Separate module files and module entry files
    const moduleFiles = [];
    const moduleEntries = {};

    filteredFiles.forEach(file =>
    {
        const fileNameNoExt = path.basename(file, path.extname(file));

        const moduleFolder = getModuleFolderForFile(file, moduleFolders);
        const isModuleEntry = (moduleFolder && fileNameNoExt === moduleFolder);

        if (isModuleEntry)
        {
            moduleEntries[moduleFolder] = file;
        }
        else if (moduleFolder)
        {
            moduleFiles.push(file); // Store module files
        }
    });

    // Sort files to ensure base scripts come first
    const sortedFiles = filteredFiles.sort((a, b) =>
    {
        const indexA = scriptOrder.indexOf(path.basename(a));
        const indexB = scriptOrder.indexOf(path.basename(b));
        return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });

    // Construct final ordered list
    let entryContent = [];

    // Add ordered base scripts first
    scriptOrder.forEach(base =>
    {
        const baseFile = sortedFiles.find(file => path.basename(file) === base);
        if (baseFile)
        {
            entryContent.push(baseFile);
        }
    });

    // Process modules in the correct order
    Object.keys(moduleFolders).forEach(moduleName =>
    {
        const moduleScripts = moduleFiles.filter(file => getModuleFolderForFile(file, moduleFolders) === moduleName);

        // Ensure we follow the correct order
        const orderedModules = [];
        const remainingModules = [...moduleScripts]; // Copy all scripts initially

        (moduleFolders[moduleName] || []).forEach(orderedFile =>
        {
            const matchingFile = moduleScripts.find(file => path.basename(file).toLowerCase() === orderedFile.toLowerCase());
            if (matchingFile)
            {
                orderedModules.push(matchingFile);
                remainingModules.splice(remainingModules.indexOf(matchingFile), 1); // Remove from remaining
            }
        });

        // Add explicitly ordered module files first
        entryContent.push(...orderedModules);

        // Add other module scripts next
        entryContent.push(...remainingModules);

        // Add the module entry file last
        if (moduleEntries[moduleName])
        {
            entryContent.push(moduleEntries[moduleName]);
        }
    });

    // Add remaining files that are neither base scripts nor module scripts
    sortedFiles.forEach(file =>
    {
        if (!entryContent.includes(file))
        {
            entryContent.push(file);
        }
    });

    // Write the entry.js file with proper import statements
    fs.writeFileSync(entryFilePath, normalizeLineEndings(entryContent.map(file => `import "${file.replace(/\\/g, '/')}";`).join('\n')), 'utf8');
    console.log(`Generated entry.js with ${entryContent.length} imports.`);
}

function isEntryFile(file)
{
    return ['entry.js', 'entry.min.js'].includes(path.basename(file));
}

function normalizeLineEndings(content, lineEnding = '\r\n')
{
    return content.replace(/\r\n|\r|\n/g, lineEnding);
}