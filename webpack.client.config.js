require('./node_modules/dotenv').config();
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const client = {
    entry: {
        app: './client/js/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'build/client'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'client/js'),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),*/
        new HtmlWebpackPlugin({
            template: './client/index.html'
        }),
        new webpack.DefinePlugin({
            'COWS_URL': JSON.stringify(process.env.COWS_HOST),
            'COWS_PORT': JSON.stringify(process.env.PORT || process.env.COWS_PORT),
            'COWS_PATH': JSON.stringify(process.env.COWS_PATH)
        })
    ]
};

module.exports = client;