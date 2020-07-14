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
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: srcPath,
        // loader: 'style-loader!css-loader,post-css-loader'
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // 为了支持下边用require
              plugins: [
                require('autoprefixer') // todo 这个不行啊！
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        include: srcPath,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          // {loader: 'postcss-loader'},
          {loader: 'less-loader'}
        ]
      },
      {
        test: /\.(png|jpg|svg)$/i,
        use: [
          {loader: 'url-loader',
            options: {
              limit: 200000,
              name: 'img/[name]-[hash:5].[ext]'
            }
          }
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


