const fs = require("fs");
const {parse} = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require('@babel/generator').default;
const t = require("@babel/types");

// TODO: use a proper logging solution
const DEBUG = false;

const dce = (code) => {
    // Inline mul(semiringNumber), add(semiringNumber), etc.
    code = code.replace(/mul\(semiringNumber\)/g, "_numMul");
    code = code.replace(/add\(semiringNumber\)/g, "_numAdd");
    code = code.replace(/sub\(ringNumber\)/g, "_numSub");
    code = code.replace(/div\(euclideanRingNumber\)/g, "_numDiv");

    const ast = parse(code, {sourceType: "module"});

    let inside = null;
    const depMap = Object.create(null);

    traverse(ast, {
        enter(path) {
            if (path.isVariableDeclaration()) {
                if (path.parent.type === "Program") {
                    for (const decl of path.node.declarations) {
                        const name = decl.id.name;
                        // path.node.kind = "const";
                        if (DEBUG) {
                            console.log(`entering ${name}`);
                        }
                        inside = name;
                        depMap[inside] = new Set();
                    }
                }
            }

            // TODO: don't count uses of a variable if the global variable is shadowed
            // by either a param name or a local variable declaration

            if (path.isCallExpression() && path.node.callee.type === "Identifier") {
                if (inside) {
                    if (DEBUG) {
                        console.log(`    ${path.node.callee.name}`);
                    }
                    depMap[inside].add(path.node.callee.name);
                } else {
                    throw new Error("top-level calls are not permitted");
                }
            }

            if (path.isNewExpression() && path.node.callee.type === "Identifier") {
                if (inside) {
                    if (DEBUG) {
                        console.log(`    new ${path.node.callee.name}`);
                    }
                    depMap[inside].add(path.node.callee.name);
                } else {
                    throw new Error("top-level calls are not permitted");
                }
            }

            if (path.isIdentifier() && path.parent.type !== "MemberExpression") {
                if (path.parent.type === "MemberExpression") {
                    // we're okay with member expressions as long as path.node is the object
                    if (path.node !== path.parent.object) {
                        return;
                    }
                }
                if (path.parent.type === "VariableDeclarator") {
                    // we're okay with variable declarators as long as path.node is the init
                    if (path.node !== path.parent.init) {
                        return;
                    }
                }
                if (inside) {
                    if (DEBUG) {
                        console.log(`    ${path.node.name}`);
                    }
                    if (typeof path.node.name === "string") {
                        depMap[inside].add(path.node.name);
                    }
                } else {
                    // throw new Error("top-level calls are not permitted");
                }
            }
        },
        exit(path) {
            if (path.isVariableDeclaration()) {
                if (path.parent.type === "Program") {
                    for (const decl of path.node.declarations) {
                        const name = decl.id.name;
                        if (DEBUG) {
                            console.log(`exiting: ${name}`);
                        }
                        inside = null;
                    }
                }
            }
        },
    });

    const usedDeps = new Set();

    const traverseDep = (node) => {
        if (usedDeps.has(node)) {
            return;
        }

        // this happens when we encounter a builtin identifier, e.g. Error
        // it also happens for locally defined functions which can happen
        // inside IIFEs
        if (depMap[node] === undefined) {
            if (DEBUG) {
                console.log(`encountered built-in: ${node}`);
            }
            return;
        }

        usedDeps.add(node);
    

        try {
            for (const dep of depMap[node]) {
                traverseDep(dep);
            }
        } catch (e) {
            console.log("\nERROR");
            console.log(node);
            console.log(depMap[node]);
            console.log(typeof depMap[node]);
            throw e;
        }
    }
    traverseDep("main");

    if (DEBUG) {
        console.log("\nUSED DEPS:");
        console.log(usedDeps);
    }

    traverse(ast, {
        Program(path) {
            const body = path.node.body.filter(stmt => {
                // Only filter out VariableDeclarations
                if (stmt.type === "VariableDeclaration") {
                    const decls = stmt.declarations;
                    if (decls.length === 1 && usedDeps.has(decls[0].id.name)) {
                        return true;
                    }
                    if (decls.length > 1) {
                        return true;
                    }
                    return false;
                } else {
                    // All other node types should remain
                    return true;
                }
            });
            path.node.body = body;
        }
    });

    traverse(ast, {
        exit(path) {
            if (path.isFunctionExpression()) {
                const {node} = path;
                if (!node.generator && !node.async && node.body.type === "BlockStatement") {
                    if (node.body.body.length === 1 && node.body.body[0].type === "ReturnStatement") {
                        path.replaceWith(
                            t.arrowFunctionExpression(
                                node.params,
                                node.body.body[0].argument,
                            ),
                        );
                    } else {
                        if (path.parent.type === "VariableDeclarator") {
                            // Skip constructors because they need to have access to "this"
                            if (/^[A-Z]/.test(path.parent.id.name)) {
                                return;
                            }
                        }
                        path.replaceWith(
                            t.arrowFunctionExpression(
                                node.params,
                                node.body,
                            ),
                        );
                    }
                }
            }
        },
    });

    const output = generate(ast).code.replace(/\/\/ Generated by purs version 0\.12\.2[\n]/g, "");

    return output;
}

module.exports = dce;
