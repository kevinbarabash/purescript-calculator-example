const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

const convert = require("./convert.js");

const dirs = fs.readdirSync("output");

var context = {
    warn: function (code) {
        console.warn("Warning: " + code);
    },
    error: function (code) {
        throw new Error(code);
    }
};

for (const dir of dirs) {
    mkdirp.sync(path.join("es6_output", dir));

    const files = fs.readdirSync(path.join("output", dir));
    for (const file of files) {
        if (file.endsWith(".js")) {
            const inputPath = path.join("output", dir, file);
            const outputPath = path.join("es6_output", dir, file);
            const inputCode = fs.readFileSync(inputPath, "utf-8");
            const outputCode = convert.call(context, inputCode, inputPath).code;
            fs.writeFileSync(outputPath, outputCode, "utf-8");
            console.log(`wrote ${outputPath}`);
        }
    }
}
