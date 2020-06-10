var path = require('path');
var webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};