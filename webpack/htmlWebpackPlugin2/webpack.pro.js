const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './proDist');

module.exports = {
  entry: {
    main: path.resolve(srcPath, './index')
  },
  output: {
    path: distPath,
    filename: 'js/[name].js',
    publicPath: 'http://cdn.com' // 线上地址
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.html'),
      title: 'Pupuu-test-html-webpack-plugin',
      minify: { // 压缩
        removeComments: true, // 删除注释
        collapseWhitespace: true, // 删除空格
      }
    })
  ]
};
