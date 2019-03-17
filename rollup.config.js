import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';
import purs from "rollup-plugin-purs";
import cleanup from "rollup-plugin-cleanup";

const NODE_ENV = process.env.NODE_ENV || "development";

export default {
    // input: 'output/Main/index.js',
    input: 'src/Main.purs',
    external: ['react', 'react-dom'],
    output: {
        file: 'docs/bundle.rollup.js',
        format: 'esm'
    },
    plugins: [
        purs({
            optimizations: {
                uncurry: false,
            },
        }),
        resolve(),
        globals(),
        cleanup(),
    ],
}