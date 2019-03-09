const fs = require("fs");
const path = require("path");
const cjs2ems = require("./cjs2esm.js");

const convert = (moduleName) => {
    cjs2ems(moduleName).then(output => {
        const outputPath = path.join(__dirname, "..", "docs", `${moduleName}.js`);
        fs.writeFileSync(outputPath, output, "utf-8");
        console.log(`wrote ${outputPath}`);
    }).catch((error) => {
        console.log(`error: ${error}`);
    })

}

convert("react");
convert("react-dom");
