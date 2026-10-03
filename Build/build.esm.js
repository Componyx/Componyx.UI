const fs = require('fs');
const path = require('path');
const rollup = require('./node_modules/rollup');

// Same header used by build.js - duplicated here (rather than imported) since build_esm.js is
// also usable/testable standalone. build_config.copyrightHeader is the single source of truth;
// this literal is only the fallback if that field is ever missing.
const DEFAULT_COPYRIGHT_HEADER = '/*! Componyx.UI | (c) E.H. Daanen / Componyx | BUSL-1.1 | componyx.com/license */';

function stripHeader(content, copyrightHeader)
{
    return content.split(copyrightHeader).join('');
}

function ensureSingleHeader(content, copyrightHeader)
{
    return copyrightHeader + '\n' + stripHeader(content, copyrightHeader).replace(/^\s+/, '');
}

// Copies the files in each component's Font and Data folders, keeping them with their component:
// <Resources>/Editor/Font/Editor.woff becomes <esm>/Editor/Font/Editor.woff
function copyComponentAssets(resourcesPath, esmDir)
{
    const assetFolders = ['Font', 'Data'];
    const assets = listFiles(resourcesPath, f => !f.startsWith(esmDir) && assetFolders.includes(path.basename(path.dirname(f))));

    assets.forEach(f =>
    {
        const target = path.join(esmDir, path.relative(resourcesPath, f));
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(f, target);
    });

    console.log(`  - ${assets.length} font and data file(s) copied`);
}

// Replaces the .NET WebResource urls in every css file in the ESM folder with a path relative
// to that css file, following the same folder mapping as the rest of the ESM output:
//   Componyx.UI.Editor.Resources.Font.Editor.woff     -> Editor/Font/Editor.woff
//   Componyx.UI.Base.Resources.CSS.ComponentIcons.css -> Base/ComponentIcons.css (CSS folder dropped)
function rewriteResourceUrls(esmDir)
{
    const webResourceRegex = /<%=\s*WebResource\("Componyx\.UI\.([^."]+)\.Resources\.([^"]+)"\)\s*%>/g;

    listFiles(esmDir, f => f.endsWith('.css')).forEach(cssFile =>
    {
        const css = fs.readFileSync(cssFile, 'utf8');
        const updated = css.replace(webResourceRegex, (match, component, resourcePath) =>
        {
            const target = path.join(esmDir, component, ...resourceNameToFolders(resourcePath));
            return path.relative(path.dirname(cssFile), target).replace(/\\/g, '/');
        });

        if (updated.includes('WebResource('))
            console.warn(`[esm] unresolved WebResource reference left in: ${path.relative(esmDir, cssFile)}`);

        if (updated !== css)
            fs.writeFileSync(cssFile, updated, 'utf8');
    });
}

// Turns the dotted part after "Resources." into folders plus file name:
// "Font.Editor.woff" -> ['Font', 'Editor.woff'], "CSS.Themes.Default.css" -> ['Themes', 'Default.css']
function resourceNameToFolders(resourcePath)
{
    const fileName = resourcePath.match(/[^.]+(?:\.min)?\.[a-z0-9]+$/i)[0];
    const folders = resourcePath.slice(0, -fileName.length).split('.').filter(f => f);

    if (folders[0] === 'CSS')
        folders.shift(); // css files sit directly in the component folder in the ESM output

    return [...folders, fileName];
}

// The csproj <Version> is the single source of truth for both NuGet and npm.
function readCsprojVersion(csprojPath)
{
    const csproj = fs.readFileSync(csprojPath, 'utf8');
    const match = csproj.match(/<Version>\s*([^<\s]+)\s*<\/Version>/);

    if (!match)
        throw new Error(`[esm] no <Version> found in ${csprojPath}`);

    return match[1];
}

async function buildESM(build_config, resourcesPath, jsFiles, cssFiles, packageJsonPath)
{
    const resolvedPackageJsonPath = packageJsonPath || path.resolve(__dirname, 'package.json');

    if (!fs.existsSync(resolvedPackageJsonPath))
        throw new Error(`[esm] package.json not found at: ${resolvedPackageJsonPath} - place one alongside build.js/build.config.json, or pass an explicit path.`);

    const existingPackageJson = JSON.parse(fs.readFileSync(resolvedPackageJsonPath, 'utf8'));

    if (build_config.csprojPath)
        existingPackageJson.version = readCsprojVersion(path.resolve(__dirname, build_config.csprojPath));
    else
        console.warn('[esm] build_config.csprojPath not set, using the version from package.json');

    const scriptOrder = build_config.scriptOrder;
    const moduleFolders = build_config.moduleFolders;
    const copyrightHeader = build_config.copyrightHeader || DEFAULT_COPYRIGHT_HEADER;

    // Files in scriptOrder that must be unconditionally imported into every single entry
    // file, regardless of whether that entry references them - e.g. Base.js and Library.js.
    const alwaysImportFoundation = build_config.alwaysImportFoundation || ['Base.js', 'Library.js'];

    // ESM output location is configurable relative to the Resources directory.
    const esmDir = path.resolve(resourcesPath, build_config.esmOutputPath || 'ESM');

    const esmSourceDir = path.join(esmDir, '_src');

    removeDirWithRetry(esmDir);
    fs.mkdirSync(esmSourceDir, { recursive: true });

    // Copy the .d.ts files into <esm>/types, the package always ships with types
    const typesSource = path.resolve(__dirname, build_config.typeDefinitionsPath || '../TypeDefinitions');

    if (!fs.existsSync(typesSource))
        throw new Error(`[esm] type definitions folder not found: ${typesSource}`);

    fs.cpSync(typesSource, path.join(esmDir, 'types'), {
        recursive: true,
        filter: src => fs.statSync(src).isDirectory() || src.endsWith('.d.ts')
    });

    // Copy configured package files into the ESM output.
    copyConfiguredFilesToEsm(build_config.copyToEsm, esmDir);

    try
    {
        await buildESMInner(
            resourcesPath,
            jsFiles,
            cssFiles,
            existingPackageJson,
            scriptOrder,
            moduleFolders,
            alwaysImportFoundation,
            esmDir,
            esmSourceDir,
            copyrightHeader
        );
    }
    finally
    {
        // ALWAYS clean up _src, even on error.
        removeDirWithRetry(esmSourceDir);
    }
}

function copyConfiguredFilesToEsm(copyToEsm, esmDir)
{
    if (!copyToEsm)
        return;

    copyToEsm.forEach(item =>
    {
        const config = typeof item === 'string'
            ? { source: item }
            : item;

        if (!config || !config.source)
            throw new Error('[esm] copyToEsm entries must be strings or objects with a "source" property.');

        const source = path.resolve(__dirname, config.source);
        const destination = path.resolve(
            esmDir,
            config.destination || path.basename(source)
        );

        if (!fs.existsSync(source))
        {
            console.warn(`[esm] configured copy source not found: ${source}`);
            return;
        }

        fs.cpSync(source, destination, {
            recursive: true
        });

        console.log(
            `[esm] copied ${path.relative(__dirname, source)} -> ${path.relative(esmDir, destination)}`
        );
    });
}


function getModuleFolderForFile(file, moduleFolders)
{
    const fileName = path.basename(file, '.js');

    // Case 1: this file itself IS a module entry (e.g. Bindary.js, Form.js) - the module is
    // its own name, regardless of which physical folder it happens to sit in. This is what
    // the old ancestor-walking approach got wrong: Bindary.js lives directly under the
    // generic Base/Script/ folder (no Bindary/ folder of its own), while Form.js happens to
    // sit under a coincidental top-level Form/ folder - so walking ancestors "worked" for
    // Form only by accident, and returned undefined for Bindary.
    if (Object.prototype.hasOwnProperty.call(moduleFolders, fileName))
        return fileName;

    // Case 2: this file is a submodule sitting in a folder named after its owning module
    // (e.g. .../Bindary/Renderer.js, .../Form/Renderer.js) - use ONLY the immediate parent
    // folder, never an ancestor further up, so an unrelated ancestor folder that happens to
    // share a module's name can never be mistaken for the real owner.
    const immediateParent = path.basename(path.dirname(file));

    if (Object.prototype.hasOwnProperty.call(moduleFolders, immediateParent))
        return immediateParent;

    return undefined;
}

function removeDirWithRetry(dir, attempts = 5, delayMs = 200)
{
    if (!fs.existsSync(dir))
        return;

    for (let attempt = 1; attempt <= attempts; attempt++)
    {
        try
        {
            fs.rmSync(dir, { recursive: true, force: true });
            return;
        }
        catch (err)
        {
            if (attempt === attempts)
                throw new Error(`[esm] failed to remove '${dir}' after ${attempts} attempts (likely a file still locked by another process, e.g. Visual Studio's file watcher or antivirus): ${err.message}`);

            console.warn(`[esm] '${dir}' is locked, retrying cleanup (${attempt}/${attempts})...`);

            // synchronous sleep - Atomics.wait blocks the event loop briefly, which is fine
            // here since this is a one-off build script, not a server
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
        }
    }
}

// Lists all files below a folder that match the filter.
function listFiles(dir, filter)
{
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory())
            return listFiles(full, filter);

        return filter(full) ? [full] : [];
    });
}

// Recursively lists all .d.ts files in a folder, except index.d.ts
function listDtsFiles(dir)
{
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    {
        const full = path.join(dir, entry.name);

        if (entry.isDirectory())
            return listDtsFiles(full);

        return (entry.name.endsWith('.d.ts') && entry.name !== 'index.d.ts') ? [full] : [];
    });
}

async function buildESMInner(resourcesPath, jsFiles, cssFiles, existingPackageJson, scriptOrder, moduleFolders, alwaysImportFoundation, esmDir, esmSourceDir, copyrightHeader)
{
    const nonMinJsFiles = jsFiles.filter(f => !f.endsWith('.min.js') && path.basename(f).toLowerCase() !== 'entry.js');
    const nonMinCssFiles = (cssFiles || []).filter(f => !f.endsWith('.min.css'));

    // ---- compute flattened target paths + basename lookups for import resolution ----
    const targetByFile = new Map();
    const moduleFolderByFile = new Map();

    // Global fallback: basename -> target. Only meant for genuine cross-module siblings
    // (e.g. Grid referencing top-level Button.js). Last writer wins here, which is exactly
    // why it must NOT be used as the primary lookup - two modules can legitimately each
    // have their own file with the same basename (e.g. Form/Renderer.js and Bindary/Renderer.js).
    const fileByBasename = {};

    // Per-module lookup: moduleFolder -> { basename -> target }. This is checked FIRST when
    // resolving a sibling referenced from within that same module, so Bindary.js always
    // resolves 'Renderer' to its own Bindary/Renderer.js, never Form/Renderer.js.
    const fileByBasenamePerModule = {};

    nonMinJsFiles.forEach(file =>
    {
        const target = computeEsmTargetRelative(file, moduleFolders, scriptOrder);
        targetByFile.set(file, target);

        const moduleFolder = getModuleFolderForFile(file, moduleFolders);
        moduleFolderByFile.set(file, moduleFolder);

        const basename = path.basename(file, '.js').toLowerCase();
        fileByBasename[basename] = target;

        if (moduleFolder)
        {
            if (!fileByBasenamePerModule[moduleFolder])
                fileByBasenamePerModule[moduleFolder] = {};

            fileByBasenamePerModule[moduleFolder][basename] = target;
        }
    });

    const rootLevelExports = []; // for index.js and index.d.ts: { name, path, target }
    const filesWithNoDetectedDependencies = []; // for the end-of-run summary

    nonMinJsFiles.forEach(file =>
    {
        const fileName = path.basename(file, '.js');
        const targetRelative = targetByFile.get(file);
        const outPath = path.join(esmSourceDir, targetRelative + '.js');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });

        const moduleFolder = moduleFolderByFile.get(file);
        const isModuleEntry = moduleFolder && fileName === moduleFolder;
        const isSubmodule = moduleFolder && !isModuleEntry;
        const isFoundation = scriptOrder.includes(fileName + '.js');

        let code = fs.readFileSync(file, 'utf8');

        // ---- category 1: foundation - copy as-is, no export ----
        if (isFoundation)
        {
            fs.writeFileSync(outPath, code, 'utf8');
            return;
        }

        // ---- category 2: submodule - copy AS-IS, completely untouched ----
        if (isSubmodule)
        {
            fs.writeFileSync(outPath, code, 'utf8');
            return;
        }

        // ---- category 3: entry file (module entry like Form.js, or leaf like Button.js) ----
        const siblingNames = new Set();

        // 3b) dynamic import lines (Form/Bindary/Editor module-submodule pattern)
        const dynamicImportRegex = /[ \t]*await\s+import\(`\$\{\$UI\.getScriptResourcePath\('([^']+)'\)\}`\);?[ \t]*(?:\r?\n)?/g;
        let match;

        while ((match = dynamicImportRegex.exec(code)) !== null)
            siblingNames.add(match[1].split('.').pop()); // last dot-segment is the referenced name

        code = code.replace(dynamicImportRegex, ''); // remove only the dynamic import lines themselves

        // 3c) scripts.push('Name') sibling-component dependencies (Grid, Form, Validator, etc.)
        const scriptPushRegex = /\w*[Ss]cripts?\w*\.push\(\s*'([^']+)'\s*\)/g;

        while ((match = scriptPushRegex.exec(code)) !== null)
            siblingNames.add(match[1]);

        // 3c-2) array literal assigned to a "scripts"-named variable, later referenced by
        // name in the return statement.
        const scriptArrayRegex = /(?:var|let|const)\s+\w*[Ss]cripts?\w*\s*=\s*\[\s*((?:'[^']+'\s*,?\s*)+)\]/g;

        while ((match = scriptArrayRegex.exec(code)) !== null)
        {
            const inner = match[1];
            const nameRegex = /'([^']+)'/g;
            let nameMatch;

            while ((nameMatch = nameRegex.exec(inner)) !== null)
                siblingNames.add(nameMatch[1]);
        }

        // 3c-3) inline-array return shape, e.g. Menu: return ['Menu', ['Box', 'Button']];
        const inlineArrayRegex = /return\s*\[\s*'[\w.]+'\s*,\s*\[([^\]]*)\]\s*\]/g;

        while ((match = inlineArrayRegex.exec(code)) !== null)
        {
            const inner = match[1];
            const nameRegex = /'([^']+)'/g;
            let nameMatch;

            while ((nameMatch = nameRegex.exec(inner)) !== null)
                siblingNames.add(nameMatch[1]);
        }

        // resolve every collected sibling name to a static side-effect import.
        const staticImportLines = [];

        siblingNames.forEach(name =>
        {
            const targetBasename = name.toLowerCase();

            if (targetBasename === fileName.toLowerCase())
                return; // skip self-reference

            const localMatch = moduleFolder && fileByBasenamePerModule[moduleFolder]
                ? fileByBasenamePerModule[moduleFolder][targetBasename]
                : undefined;

            const depTargetRelative = localMatch || fileByBasename[targetBasename];

            if (!depTargetRelative)
            {
                console.warn(`[esm] could not resolve sibling dependency '${name}' referenced in ${targetRelative} - no matching file found`);
                return;
            }

            staticImportLines.push(`import '${toRelativeImportPath(targetRelative, depTargetRelative)}';`);
        });

        if (staticImportLines.length === 0 && (isModuleEntry || moduleFolder === undefined))
            filesWithNoDetectedDependencies.push(targetRelative); // informational only

        // 3a) prepend foundation side-effect imports, then the resolved sibling imports.
        const foundationImportLines = alwaysImportFoundation
            .filter(f => f !== 'UIResourcePath.js')
            .map(f =>
            {
                const foundationTarget = fileByBasename[f.replace(/\.js$/, '').toLowerCase()];
                return `import '${toRelativeImportPath(targetRelative, foundationTarget)}';`;
            });

        const allImportLines = [...foundationImportLines, ...staticImportLines];

        if (allImportLines.length)
            code = allImportLines.join('\n') + '\n\n' + code;

        // 3e) determine this file's own export and append it, reading from the global -
        // the wrapper above is NEVER stripped, this works regardless
        const entryExport = findEntryExport(code, fileName);

        if (entryExport)
        {
            code += `\n\nconst ${entryExport.name} = componyx.${entryExport.path};\nexport { ${entryExport.name} };\n`;

            rootLevelExports.push({ name: entryExport.name, path: entryExport.path, target: targetRelative });
        }
        else
        {
            code += `\n\n// WARNING: could not detect export assignment for ${fileName} - add export manually\n`;
            console.warn(`[esm] could not detect export assignment for: ${targetRelative} - check its actual global-property convention and add an export by hand`);
        }

        fs.writeFileSync(outPath, code, 'utf8');
    });

    // ---- bundle with Rollup, preserveModules keeps each file separate/tree-shakeable ----
    const esmRollupConfig = {
        input: nonMinJsFiles.map(file => path.join(esmSourceDir, targetByFile.get(file) + '.js')),
        output: {
            dir: esmDir,
            format: 'es',
            preserveModules: true,
            preserveModulesRoot: esmSourceDir,
            entryFileNames: '[name].js'
        }
    };

    const bundle = await rollup.rollup(esmRollupConfig);
    await bundle.write(esmRollupConfig.output);

    // Rollup strips "use strict" directives when outputting ES module format (redundant there,
    // since ESM is implicitly strict), and a comment attached to that directive in the parsed
    // syntax tree - including our header, when it sits directly above "use strict" in the
    // original source - gets removed right along with it. Rather than rely on the header
    // surviving Rollup's output generation, add it back explicitly to every file Rollup just
    // wrote, exactly once, regardless of whether it made it through intact or not.
    targetByFile.forEach(target =>
    {
        const outPath = path.join(esmDir, target + '.js');
        const content = fs.readFileSync(outPath, 'utf8');
        fs.writeFileSync(outPath, ensureSingleHeader(content, copyrightHeader), 'utf8');
    });

    // ---- copy CSS files straight to their final esmDir locations. Rollup's input array only
    // ever references JS files (see above), so CSS never needs to pass through esmSourceDir
    // at all - one copy, straight from source to destination. ----
    nonMinCssFiles.forEach(file =>
    {
        const targetRelative = computeEsmCssTargetRelative(file, resourcesPath);
        const outPath = path.join(esmDir, targetRelative + '.css');
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.copyFileSync(file, outPath);
    });

    // ---- fonts and data files next to their component, then point the css resource urls at them ----
    copyComponentAssets(resourcesPath, esmDir);
    rewriteResourceUrls(esmDir);

    // ---- generate index.js re-exporting every top-level component ----
    const indexContent = rootLevelExports
        .map(e => `export { ${e.name} } from './${e.target}.js';`)
        .join('\n') + '\n';

    fs.writeFileSync(path.join(esmDir, 'index.js'), indexContent, 'utf8');

    // ---- generate types/index.d.ts: references to all .d.ts files + one export per component ----
    const typesDir = path.join(esmDir, 'types');

    const referenceLines = listDtsFiles(typesDir)
        .map(f => path.relative(typesDir, f).replace(/\\/g, '/'))
        .sort()
        .map(f => `/// <reference path="./${f}" />`);

    const typeExportLines = rootLevelExports
        .map(e => `export import ${e.name} = componyx.${e.path};`);

    fs.writeFileSync(path.join(typesDir, 'index.d.ts'), [...referenceLines, '', ...typeExportLines].join('\n') + '\n', 'utf8');

    // ---- generate package.json: preserve everything existing, only add/overwrite the
    //      fields that actually need to be computed. Deliberately no "sideEffects" field -
    //      see header comment for why that would be unsafe for this codebase. ----
    const packageJson = {
        ...existingPackageJson,
        type: 'module',
        main: './ui.min.js',
        module: './index.js',
        types: './types/index.d.ts',
        exports: {
            '.': {
                types: './types/index.d.ts',
                import: './index.js',
                default: './ui.min.js'
            },
            './*.js': './*.js',
            './*.css': './*.css',
            './*': './*.js',
            './package.json': './package.json'
        }
    };

    fs.writeFileSync(path.join(esmDir, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

    console.log(`ESM build complete: ${esmDir}`);
    console.log(`  - ${rootLevelExports.length} components exported via index.js`);
    console.log(`  - package.json generated (name: ${packageJson.name}, version: ${packageJson.version})`);

    if (filesWithNoDetectedDependencies.length)
        console.log(`  - ${filesWithNoDetectedDependencies.length} entry file(s) had no sibling dependencies detected (expected for most simple components, worth a spot-check for complex ones): ${filesWithNoDetectedDependencies.join(', ')}`);
}

function findEntryExport(code, fileName)
{
    let m;

    if ((m = code.match(new RegExp(`componyx\\.UI\\.(${fileName})\\s*=`))))
        return { path: `UI.${m[1]}`, name: m[1] };

    if ((m = code.match(new RegExp(`componyx\\.base_modules\\.(${fileName})\\s*=`))))
        return { path: `base_modules.${m[1]}`, name: m[1] };

    if ((m = code.match(new RegExp(`componyx\\.(${fileName})\\s*=`, 'i'))))
        return { path: m[1], name: m[1] };

    return null;
}

function computeEsmTargetRelative(file, moduleFolders, scriptOrder)
{
    const fileName = path.basename(file, '.js');

    if (scriptOrder.includes(fileName + '.js'))
        return `Base/${fileName}`;

    const moduleFolder = getModuleFolderForFile(file, moduleFolders);

    if (moduleFolder)
    {
        const isModuleEntry = fileName === moduleFolder;

        if (isModuleEntry)
            return `${fileName}/${fileName}`;

        return `${moduleFolder}/Modules/${fileName}`;
    }

    return `${fileName}/${fileName}`;
}

// <Component>/CSS/<path> becomes <Component>/<path>, so themes always end up in
// <Component>/Themes, e.g. Editor/CSS/Themes/Default.css -> Editor/Themes/Default.css
function computeEsmCssTargetRelative(file, resourcesPath)
{
    const parts = path.relative(resourcesPath, file).split(path.sep);
    const cssIndex = parts.indexOf('CSS');
    const afterCss = cssIndex >= 0 ? parts.slice(cssIndex + 1) : parts.slice(1);

    return [parts[0], ...afterCss].join('/').replace(/\.css$/, '');
}

function toRelativeImportPath(fromTarget, toTarget)
{
    const fromDir = path.dirname(fromTarget);
    let rel = path.relative(fromDir, toTarget).replace(/\\/g, '/');

    if (!rel.startsWith('.'))
        rel = './' + rel;

    return rel + '.js';
}

module.exports = { buildESM, getModuleFolderForFile, rewriteResourceUrls };