// node没有windows对象，有global对象
// console.log(global);

// g variable:
// __filename
// __dirname
// process

// g func:
// setInterval
// clearInterval
// setTimeout
// clearTimeout
// ...

console.log(`process argv     : ${process.argv}`);
console.log(`process env      : ${process.env.NODE_ENV}`); // ☆环境
console.log(`process platform : ${process.platform}`);
console.log(`process pid      : ${process.pid}`);
console.log(`process cwd()    : ${process.cwd()}`); // ☆脚本跑的位置（非脚本位置）

