# Building Componyx.UI

This document describes how to build Componyx.UI from source.

The repository contains the source code, build scripts and build dependencies required to generate the browser resources, ESM distribution and .NET package resources.

## Requirements

The following are required:

* .NET 10 SDK
* Node.js (includes npm)

Node.js is used by the JavaScript build tooling.

---

## Build configuration

The JavaScript build configuration is located at:

```text
Build/build_config.json
```

The build scripts and supporting tools are located in the same directory:

```text
Build/
├── build.js
├── build.esm.js
├── build_config.json
├── rollup.config.js
├── package.json           (build tooling dependencies, not published)
├── package.template.json  (npm package metadata, copied into the ESM output)
├── package-lock.json
└── node_modules/          (generated, not committed)
```

The configuration controls the resource location, JavaScript build settings, ESM generation and module handling.

The main settings include:

* `resourcesPath` — location of the project's `Resources` directory.
* `entryFilePath` — temporary/generated entry file used during the build.
* `backupDir` — location used for temporary script backups.
* `isMinify` — controls minification.
* `buildESM` — enables generation of the ESM distribution.
* `esmOutputPath` — output directory for the per-component ESM build.
* `bundledOutputPath` — output directory for the single-file browser bundle (`UI.js` / `UI.min.js`).
* `typeDefinitionsPath` — location of the TypeScript definition source files, copied into the ESM output's `types/` folder.
* `copyToEsm` — additional files (README, LICENSE, etc.) copied into the ESM output as-is.
* `scriptOrder` — defines the order of core scripts in the bundled build.
* `moduleFolders` — defines additional module files that must be included from component folders.
* `excludeFiles` — defines files that must be excluded from the bundled build.

`esmOutputPath` and `bundledOutputPath` are both resolved relative to `resourcesPath`, not relative to the `Build` folder itself.

The configuration should normally be changed only when the JavaScript source structure or build requirements change.

---

## JavaScript build dependencies

The JavaScript build uses local build dependencies (Rollup, esbuild, and their plugins) declared in:

```text
Build/package.json
```

This file lists only the build tooling's own dependencies. It is a separate, private manifest from `package.template.json`, which holds the metadata (name, version, license, etc.) published as part of the npm package, the two are never merged.

### Restoring the build dependencies

Before building the project for the first time, install the dependencies from inside the `Build` folder:

```bash
cd Build
npm ci
```

This reads `package-lock.json` and installs the exact locked dependency versions into `Build/node_modules/`.

`Build/node_modules/` and `Build/backup/` are excluded from source control via `.gitignore` and are regenerated automatically; only `package.json`, `package.template.json`, `package-lock.json` and the actual build scripts are committed.

---

## Building the project

Do not build the complete solution when working with the repository unless required.

The JavaScript build is invoked as part of the appropriate project build process (the `.csproj`'s PostBuild target calls `node build.js` from the `Build` folder).

The build script is:

```text
Build/build.js
```

The script uses:

```text
Build/build_config.json
```

for its configuration.

The build process prepares the JavaScript and CSS resources used by Componyx.UI and its integrations.

---

## JavaScript bundling

During the build, the JavaScript source files are collected and bundled according to the settings in `build_config.json`.

The following configuration controls the main script order:

```json
"scriptOrder": [
  "Library.js",
  "Base.js",
  "UIResourcePath.js",
  "ResponsiveTemplates.js",
  "NavigationManager.js",
  "Sanitizer.js"
]
```

Additional module files can be specified through `moduleFolders`.

For example:

```json
"moduleFolders": {
  "Bindary": [
    "Core.js",
    "DataUpdater.js",
    "Connection.js"
  ],
  "Editor": [
    "HtmlSourceViewBuilder.js"
  ],
  "Form": [
    "Types.js",
    "Draggable.js"
  ]
}
```

Files listed in `excludeFiles` are excluded from the bundled build.

For example:

```json
"excludeFiles": [
  "UI.js"
]
```

---

## Temporary build files and backups

The JavaScript build may temporarily modify the way source files are processed.

Before processing, the build script creates backups in:

```text
Build/backup/
```

The build process also generates a temporary entry file based on:

```json
"entryFilePath": "entry.js"
```

These files are build artifacts and are not part of the public Componyx.UI API. The build process restores the affected source files, and removes the backup folder, after processing.

---

## ESM build

The build also generates an ES module distribution for the npm package.

This is enabled through:

```json
"buildESM": true
```

The ESM output directory is configured as:

```json
"esmOutputPath": "../ESM"
```

resolved relative to `resourcesPath`. With the current configuration, this places the output at the project root:

```text
ESM/
```

Unlike the browser bundle, the ESM distribution keeps the individual component modules available as ES modules.

The ESM build also generates an:

```text
ESM/index.js
```

entry point.

This file exports the public Componyx.UI components, for example:

```javascript
export { Button } from './Button/Button.js';
export { Grid } from './Grid/Grid.js';
export { Dialog } from './Dialog/Dialog.js';
```

This provides a single entry point for the npm package while keeping the individual component modules available internally.

The `index.js` file is generated as part of the build and should not normally be edited manually.

### Package metadata

The `ESM/package.json` published as part of the npm package is generated from:

```text
Build/package.template.json
```

Fields in `package.template.json` (name, description, license, keywords, etc.) are copied through as-is; `main`, `module`, `types` and `exports` are computed and added by the build itself. `package.template.json` should be edited when the package's published metadata needs to change; it should never contain build-tooling dependencies.

### Additional files copied into the ESM output

Files listed in `copyToEsm` are copied into the ESM output unchanged, for example:

```json
"copyToEsm": [
  "../README.md",
  "../LICENSE",
  "../componyx.html-data.json"
]
```

paths are resolved relative to the `Build` folder.

---

## Minification

JavaScript and CSS resources are minified as part of the build when:

```json
"isMinify": true
```

Minification is performed using esbuild, installed as an npm dependency (`Build/node_modules/esbuild`) and invoked through its JavaScript API.

Minified resources are generated alongside the appropriate release resources.

---

## Build outputs

The build produces resources used by the different Componyx.UI distribution mechanisms.

### Browser resources

The main browser resources are generated under:

```text
Resources/
```

These resources are used by applications consuming Componyx.UI directly in the browser.

### ESM / npm resources

The ESM distribution is generated under:

```text
ESM/
```

This directory contains the ES module version of the components, the generated `index.js` entry point, the generated `package.json`, and the TypeScript definitions (`types/`), used by the npm package.

### .NET resources

The generated browser resources are also included by the .NET integration when the .NET project is built and packaged.

---

## Changing the JavaScript source structure

When adding or moving JavaScript files, check whether the build configuration needs to be updated.

In particular, check:

```text
Build/build_config.json
```

The following settings may need to be updated:

* `scriptOrder`
* `moduleFolders`
* `excludeFiles`
* `buildESM`
* `esmOutputPath` / `bundledOutputPath`

When adding a new public component, make sure it is also included in the generated ESM exports.

---

## Troubleshooting

### `node_modules` is missing

If the JavaScript build fails because required Node modules cannot be found, install them from inside the `Build` folder:

```bash
cd Build
npm ci
```

### Build output is missing

Check:

```text
Build/build_config.json
```

and verify the configured resource paths and build options.

In particular, check:

```json
"resourcesPath": "../Resources"
```

and:

```json
"buildESM": true
```

### ESM output is missing

Verify that:

```json
"buildESM": true
```

and:

```json
"esmOutputPath": "../ESM"
```

are configured correctly.

The expected output directory, with the current configuration, is:

```text
ESM/
```

### Type definitions are missing from the package

Check:

```json
"typeDefinitionsPath": "../TypeDefinitions"
```

If this path does not resolve to an existing folder (relative to `Build`), the build logs a warning and the published package will have no types, this does not fail the build.

---

## Build configuration reference

The current configuration is:

```json
{
  "resourcesPath": "../Resources",
  "entryFilePath": "entry.js",
  "backupDir": "backup",
  "esmOutputPath": "../ESM",
  "bundledOutputPath": "../ESM",
  "isMinify": true,
  "buildESM": true,
  "typeDefinitionsPath": "../TypeDefinitions",
  "copyToEsm": [
    "../README.md",
    "../LICENSE",
    "../componyx.html-data.json"
  ],
  "scriptOrder": [
    "Library.js",
    "Base.js",
    "UIResourcePath.js",
    "ResponsiveTemplates.js",
    "NavigationManager.js",
    "Sanitizer.js"
  ],
  "moduleFolders": {
    "Bindary": [
      "Core.js",
      "DataUpdater.js",
      "Connection.js"
    ],
    "Editor": [
      "HtmlSourceViewBuilder.js"
    ],
    "Form": [
      "Types.js",
      "Draggable.js"
    ]
  },
  "excludeFiles": [
    "UI.js"
  ]
}
```

The configuration file is the authoritative source for the current build settings. This document explains the purpose of those settings and the overall build process.