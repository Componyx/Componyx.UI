const resolve = require('@rollup/plugin-node-resolve');  // Plugin for resolving node_modules

module.exports = {
    input: [], // To be set dynamically in build.js
    output: {
        file: '', // Will be set dynamically in build.js
        format: 'esm',  // Change from 'iife' to 'esm' for multiple files
        name: 'componyx',  // Global variable name for the bundled script
        inlineDynamicImports: true
    },
    plugins: [
        resolve()
    ],
};