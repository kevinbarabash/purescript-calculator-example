const rollup = require('rollup');

const commonjsPlugin = require('rollup-plugin-commonjs');
const resolvePlugin = require('rollup-plugin-node-resolve');
const autoExternalPlugin = require('rollup-plugin-auto-external');
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

async function build(moduleName) {
    const basedir = process.cwd();
    const {res, pkg} = await resolvePkg(moduleName, {basedir: basedir});

    // TODO(kevinb): make this configurable
    const useModule = false; // pkg && pkg.module && pkg.name.startsWith("@khanacademy");

    let input = res;

    if (useModule) {
        input = res.replace(pkg.main, pkg.module)
    } else if (pkg && pkg.name === "react-router-dom") {
        // UMD versions of modules are really easy for rollup to convert to
        // ES6 modules because they've already been bundled into a single
        // file.
        input = res.replace(pkg.main, "umd/react-router-dom.js")
    } else if (pkg && pkg.name === "aphrodite") {
        input = res.replace(pkg.main, "dist/aphrodite.umd.js")
    } else if (pkg && pkg.name === "react-dom") {
        input = res.replace(pkg.main, "cjs/react-dom.production.min.js")
    } else if (pkg && pkg.name === "react") {
        input = res.replace(pkg.main, "cjs/react.production.min.js");
    }

    console.log(input);

    const plugins = [
        replacePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
    ];
    
    // For ES6 modules we don't want exclude all dependencies from the bundle.
    // The reason for this is that some of them may or may not be ES6 modules
    // and rollup doesn't work well when including a CommonJS module from an
    // ES6 module.
    if (useModule) {
        plugins.push(
            autoExternalPlugin({
                packagePath: res.replace(pkg.main, "package.json"),
            })
        );
    }
        
    plugins.push(
        resolvePlugin({
            module: true,
            jsnext: true,
            main: true,
            browser: true,
        }),
    );

    // For CommonJS modules we have to provide a list of named exports.
    if (!useModule) {
        plugins.push(
            commonjsPlugin({
                namedExports: {
                    [input]: Object.keys(require(input)).filter(key => key !== "default"),
                },
            })
        );
    }

    const inputOptions = {
        input,
        plugins,
        external: moduleName === "react-dom" ? ["react"] : [],
    };

    const outputOptions = {
        format: 'esm',
    };

    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    // generate code and a sourcemap
    const {output} = await bundle.generate(outputOptions);

    let code = output[0].code;

    // TODO: use built-in plugin
    code = code
        .replace(/process\.env\.NODE_ENV/g, '"production"');

    // // rename imports to have an absolute path
    // // note: rollup generates 'import Foo from "foo"' statements instead of 
    // // 'import * as Foo from "foo"'.
    return code.replace(/\s+from\s+['"]([^'"]+)['"]/g, 
        (match, path) => ` from "./${path}.js"`);
}

module.exports = build;
