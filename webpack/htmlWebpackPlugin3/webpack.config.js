const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const srcAPath = path.resolve(__dirname, './srcA');
const srcBPath = path.resolve(__dirname, './srcB');
const srcCPath = path.resolve(__dirname, './srcC');
const distPath = path.resolve(__dirname, './dist');

const templateHtml = path.resolve(__dirname, 'index.html');

module.exports = {
  entry: {
    main: path.resolve(srcPath, 'index.js'),
    a: path.resolve(srcAPath, 'index.js'),
    b: path.resolve(srcBPath, 'index.js'),
    c: path.resolve(srcCPath, 'index.js'),
  },
  output: {
    path: distPath,
    filename: 'js/[name].js'
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['main'],
      template: templateHtml,
      title: 'main-html'
    }),
    new htmlWebpackPlugin({
      filename: 'a.html',
      chunks: ['main', 'a'],
      template: templateHtml,
      title: 'a-html'
    }),
    new htmlWebpackPlugin({
      filename: 'b.html',
      chunks: ['main', 'b'],
      template: templateHtml,
      title: 'b-html'
    }),
    new htmlWebpackPlugin({
      filename: 'c.html',
      chunks: ['main', 'c'],
      template: templateHtml,
      title: 'c-html'
    })
  ]
};
