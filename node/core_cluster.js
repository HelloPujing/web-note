// Node.js默认单进程运行
// 对于多核CPU效率极低（因为只有一个核在运行，其他都闲置）
// cluster就是为了解决这个问题而提出的

// cluster模块允许建立一个主进程和若干worker进程
// 主进程：监控和协调worker进程
// worker进程之间：进程间通信交换信息
// 运行时：所有新建的链接都有主进程完成，然后主进程再把tcp连接分配给指定的work进程
// cluster.fork 主进程新建一个work进程

const cluster1 = require('cluster');
const os = require('os');
const http = require('http');

if (cluster1.isMaster) {
  for(let i = 0, n = os.cpus().length; i < n; i++) {
    cluster1.fork();
  }
} else {
  http.createServer(function(req, res){
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
}

// work进程挂了，主进程不知道
// 解决：主进程部署online事件和exit事件的监听函数
const cluster2 = require('cluster');

if (cluster2.isMaster) {
  const numWorkers = os.cpus().length;
  console.log(`Master cluster setting up ${numWorkers} workers ...`);
  for(let i = 0; i < numWorkers; i++) {
    cluster2.fork();
  }
  cluster2.on('online', function(worker){
    console.log(`Worker ${worker.process.pid} is online`);
  });
  cluster2.on('exit', function(worker, code, signal){
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log('Starting a new work');
    cluster2.fork();
  });
}

// worker 对象
// cluster.fork()的返回值，代表一个worker进程
// worker.id 进程编号，也是cluster.workers中指向当前进程的索引号
// worker.process 所有worker进程都是用child_process.fork()生成的
//  child_process.fork()返回的对象，就被保存在cluster.process之中
//  通过这个属性，可以获得work所在进程的对象
// worker.send() 主进程向子进程发送信息

// worker 对象
// worker
