const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const server = {
    entry: './server/main.js',
    target: 'node',
    externals: [nodeExternals()],
    node: {
        __dirname: false,
        __filename: false
    },
    output: {
        path: path.resolve(__dirname, 'build/server'),
        filename: 'main.js'
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
            path.resolve(__dirname, 'server')
        ]
    }
};

module.exports = server;