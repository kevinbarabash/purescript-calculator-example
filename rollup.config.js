import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import replace from 'rollup-plugin-replace';

const NODE_ENV = process.env.NODE_ENV || "development";

export default {
    input: 'es6_output/Main/index.js',
    output: {
        file: 'docs/bundle.js',
        format: 'esm'
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        resolve(),
        commonjs({
            namedExports: {
                'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement', 'Fragment'],
                'node_modules/react-dom/index.js': ['render', 'hydrate', 'createPortal', 'findDOMNode', 'unmountComponentAtNode']
            },
        }),
        globals(),
    ],
}
