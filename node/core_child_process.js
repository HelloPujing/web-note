const exec = require('child_process').exec;

// exec两个参数
// 第一个：要执行的shell命令
// 第二个：回调 error, stdout, stderr
const ls = exec('ls -z', function(error, stdout, stderr){
  if(error) {
    console.log('error.stack：');
    console.log(error.stack);
    console.log('error code', error.code);
    console.log('stderr:', stderr);
  }
  console.log(stdout);
});

// 首先，stdout 和 stderr 都是流对象，可以监听data对象
// 所以也可以写成下边形式
// 其次，并且子进程本身都有close事件，可设置回调函数
// 最后，这种形式优于第一种方式
// 因为监听数据后，可实时输出结果；而第一种方式要等子进程结束后才执行回调
const child = exec('ls -l');
child.stdout.on('data', function(data){
  console.log('stdout', data);
});
child.stderr.on('data', function(data){
  console.log('stderr', data);
});
child.on('close', function(code){
  console.log('close code:', code);
});

// 点
