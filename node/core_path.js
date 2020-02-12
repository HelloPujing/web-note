const path = require('path');
// const chalk = require('chalk');
// executing script file name (with path)
console.log(`__filename: ${__filename}`);
// executing script path
console.log(`__dirname : ${__dirname}`);
console.log('');


// 以下两结果相同；都是连接路径
console.log(`join    __dirname: ${path.join(__dirname, '..', './nodeCmd', 'readme.md')}`);
console.log(`resolve __dirname: ${path.resolve(__dirname, '..', './nodeCmd', 'readme.md')}`);
console.log('');

// 以下两结果不同；∴ 区别：
// join不一定绝对路径，主要是解决不同操作系统斜杠不同的问题；
// resolve一定是返回绝对路径
console.log(`join   : ${path.join('..', './nodeCmd', 'readme.md')}`);
console.log(`resolve: ${path.resolve('..', './nodeCmd', 'readme.md')}`);
console.log('');

