const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const process = require("process");

const convert = require("./convert.js");
const bundleDep = require("./bundle-dep.js");
const bundleMain = require("./bundle-main.js");

const cwd = process.cwd();

// TODO: make these paths configurable
const inputDir = path.join(cwd, "output");
const tempDir = path.join(cwd, "es6_output");
const outputDir = path.join(cwd, "docs");

var context = {
    warn: function (code) {
        console.warn("Warning: " + code);
    },
    error: function (code) {
        throw new Error(code);
    }
};

// Convert purs output to ES6 modules
console.log("Upgrading purs output from ES5 to ES6: ");
for (const dir of fs.readdirSync(inputDir)) {
    mkdirp.sync(path.join("es6_output", dir));

    const files = fs.readdirSync(path.join(inputDir, dir));
    for (const file of files) {
        if (file.endsWith(".js")) {
            const inputPath = path.join(inputDir, dir, file);
            const outputPath = path.join(tempDir, dir, file);
            const inputCode = fs.readFileSync(inputPath, "utf-8");
            const outputCode = convert.call(context, inputCode, inputPath).code;
            fs.writeFileSync(outputPath, outputCode, "utf-8");
            process.stdout.write(".");
        }
    }
}
process.stdout.write("\n");

// Bundle ES6 modules and remove dead code
bundleMain(
    path.join(tempDir, "Main", "index.js"), 
    path.join(outputDir, "bundle.min.js"),
).then(() => console.log("Finished bundling bundle.min.js"));

// TODO: get these from the current package
const deps = ["react", "react-dom"];

for (const dep of deps) {
    bundleDep(dep).then(output => {
        const outputPath = path.join(outputDir, `${dep}.js`);
        fs.writeFileSync(outputPath, output, "utf-8");
        console.log(`wrote ${outputPath}`);
    }).catch((error) => {
        console.log(`error: ${error}`);
    });
}