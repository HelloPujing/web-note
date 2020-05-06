# webpack Test Config
- npm init -y
- npm install webpack
- src/index.js
- dist
- index.html引入script，src为bundle.js

# config
- 创建webpack.config.js文件
- module.exports = {}
- entry/output
- package.json的script里写打包命令`npx webpack --config webpack.config.js --color --display-module --mode production`
