// Getting Started
// Proxy
// 用自己的定义，覆盖了语言原始的定义
// 先看个例子感性认识一下：
// 下边的例子，实际重载了点运算符
var obj = new Proxy({}, {
  get: (target, key, receiver) => {
    console.log(`get ${key}`);
    return Reflect.get(target, key, receiver);
  },
  set: (target, key, value, receiver) => {
    console.log(`set ${key}`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1; // set count
++obj.count; // get count | set count

// proxy
// 都可以用以下形式创建，不同的是，handler的写法不同

const proxy = new Proxy(
  //target,
  // handler
);
