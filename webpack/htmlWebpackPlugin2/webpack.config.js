const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    hello: path.resolve(srcPath, 'index.js')
  },
  output: {
    filename: 'js/[name].js',
    path: distPath,
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.html'),
      title: 'Pupuu-test-html-webpack-plugin',
      pupuuValue: 'Pupuu Value'
    })
  ]
};
