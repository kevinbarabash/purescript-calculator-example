const rollup = require('rollup');

const commonjsPlugin = require('rollup-plugin-commonjs');
const resolvePlugin = require('rollup-plugin-node-resolve');
const replacePlugin = require("rollup-plugin-replace");

const resolveModule = require('resolve');

async function resolvePkg(moduleName, options) {
    return new Promise((resolve, reject) => {
        resolveModule(moduleName, options, (err, res, pkg) => {
            if (err) {
                reject(err);
            } else {
                resolve({res, pkg});
            }
        });
    });
}

async function bundleDep(moduleName) {
    const basedir = process.cwd();
    const {res, pkg} = await resolvePkg(moduleName, {basedir: basedir});

    const input = res;

    // Set the current NODE_ENV to production so that when rollup requires "react"
    // we'll get the production version.
    // TODO: make this configurable and make replacePlugin mirror the setting.
    process.env.NODE_ENV = "production";

    const plugins = [
        // Replace "process.env.NODE_ENV" with "production" in the output
        replacePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),

        // Resolve node_modules
        resolvePlugin(),

        // All commonjs modules to be imported
        commonjsPlugin({
            // Provide a list of named exports
            namedExports: {
                [input]: Object.keys(require(input)).filter(key => key !== "default"),
            },
        }),
    ];
 
    // Define a bundle
    const bundle = await rollup.rollup({
        input,
        plugins,
        // Make all peer deps external.
        external: pkg.peerDependencies
            ? Object.keys(pkg.peerDependencies)
            : [],
    });

    // Generate code
    const {output} = await bundle.generate({
        format: 'esm',
    });

    // Rename imports to have an absolute path.
    // Rollup generates 'import Foo from "foo"' statements instead of 'import * as Foo from "foo"'.
    // TOOD: make this configurable
    return output[0].code.replace(/\s+from\s+['"]([^'"]+)['"]/g, 
        (match, path) => ` from "./${path}.js"`);
}

module.exports = bundleDep;
