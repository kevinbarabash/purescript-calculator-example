'use strict';

const path = require('path');

const webpack = require('webpack');

const isWebpackDevServer = process.argv.some(a => path.basename(a) === 'webpack-dev-server');

const isWatch = process.argv.some(a => a === '--watch');

const plugins =
    isWebpackDevServer || !isWatch ? [] : [
        function () {
            this.plugin('done', function (stats) {
                process.stderr.write(stats.toString('errors-only'));
            });
        }
    ]
    ;

module.exports = {
    // devtool: 'eval-source-map',
    devtool: 'none',

    devServer: {
        contentBase: '.',
        port: 4008,
        stats: 'errors-only'
    },

    entry: './src/main.js',

    output: {
        path: __dirname,
        pathinfo: true,
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.purs$/,
                use: [
                    {
                        loader: 'purs-loader',
                        options: {
                            src: [
                                'bower_components/purescript-*/src/**/*.purs',
                                'src/**/*.purs'
                            ],
                            // bundle: true,
                            bundle: false,
                            psc: 'psa',
                            watch: isWebpackDevServer || isWatch,
                            pscIde: true,
                            pscBundleArgs: {
                                main: "Main",
                            },
                        }
                    }
                ]
            },
        ]
    },

    resolve: {
        modules: ['node_modules', 'bower_components'],
        extensions: ['.purs', '.js']
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
    ].concat(plugins),

    optimization: {
        splitChunks: {
            chunks: "all",
            minChunks: 1,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 0,
                },
                default: false,
            },
        },
    },
};
