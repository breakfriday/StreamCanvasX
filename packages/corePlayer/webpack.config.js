const webpack = require('webpack');
const packagejson = require("./package.json");
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'playercore.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'mpegts',
        libraryTarget: 'umd'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            "events": require.resolve("events"),
            // 对于需要的 Node.js core 模块，提供浏览器兼容的实现
            // 例如：如果你确实需要 'path' 模块的浏览器版
            // "path": require.resolve("path-browserify")
          }
    },

    plugins: [
        new webpack.DefinePlugin({
          __VERSION__: JSON.stringify(packagejson.version)
        })
    ],

    // node: {
    //     'fs': 'empty',
    //     'path': 'empty'
    // },

    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true
            })
        ]
    },

    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: 'ts-loader',
                exclude: /node-modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            }
        ]
    },

    devServer: {
        static: ['demo'],
        proxy: {
            '/dist': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/dist' : ''}
            }
        }
    }
};
