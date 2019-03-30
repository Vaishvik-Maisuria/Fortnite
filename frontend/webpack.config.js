const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var config = {
    
    entry: ['babel-polyfill','./src/index.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/          
            },
            {
                test:/\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            },
            {
                test: /\.(png|jpg|)$/,
                loader: 'url-loader?limit=20000000'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new CleanWebpackPlugin('/dist', {})
    ],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    }

}

module.exports = config;