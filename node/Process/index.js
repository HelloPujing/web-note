const http = require('http');

const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 100000000; i++){
    sum += 1;
  }
  return sum;
};

// 开启服务进程
const server = http.createServer();

server.on('request', (req, res) => {
  if (req.url === '/compute') {
    console.info('计算开始', new Date());
    const sum = longComputation();
    console.info('计算结束', new Date());
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('OK');
  }
});

server.listen(1998, () => {
  process.title='Pupuu开启了一个服务进程';
  console.log('进程id', process.pid);
});
