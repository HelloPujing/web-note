const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: path.resolve(srcPath, './index'),
  output: {
    path: distPath,
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: srcPath,
        loader: 'babel-loader'
      },
      // {
      //   test: /\.css$/,
      //   exclude: [/node_modules/, path.resolve(srcPath, './style')],
      //   include: srcPath,
      //   loader: 'css-loader'
      // },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: srcPath,
        // loader: 'style-loader!css-loader,post-css-loader'
        loaders: [
          'style-loader',
          'css-loader'
          // 'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(srcPath, 'index.html'),
      inject: 'body'
    })
  ]
};


