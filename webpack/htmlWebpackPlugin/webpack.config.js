const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    main: path.resolve(srcPath, './index')
  },
  output: {
    path: path.resolve(distPath),
    filename: 'js/[name].js'
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html', // 默认index.html
      inject: 'body', // 默认body
      template: 'index.html' // 根目录html
    })
  ]
};
