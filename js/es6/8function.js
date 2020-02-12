// 【默认值】
const m1 = (x = 1) => { console.log(`m1-result:${x}`) };
m1(); // 1

// 【默认赋值 + 解构赋值】
const m2 = ({ x = 0, y = 0 } = {}) => { console.log(`m2-result:${x} ${y}`)  };
const m3 = ({ x, y } = { x: 0, y: 0 }) => { console.log(`m3-result:${x} ${y}`)  };
m2({x: 1}); // 1 0
m3({x: 1}); // 1, undefined

// 【位置】一般默认值设置在参数末尾，不然这个参数无法跳过

// 【rest参数】代替arguments且当真正数组用，参数末尾
const m4 = (...rest) => { console.log('m4-result:', rest) };
m4(1,2,3);

// 【函数属性】 名称、参数长度(未赋默认值的个数)
const m5 = (x, y = 2) => {  };
console.log('m5-result(名称、参数长度):', m5.name, m5.length);

//【箭头函数】
// 单个参数 => 返回值(不需要return关键词)/不需要返回的执行语句
// (多个参数) => {多条语句}
const m6 = (x, y) => console.log('m6-result:', x + y);
const m7 = x => {
  console.log('m7-result:', 2 * x);
  console.log('m7-result:',Math.pow(x, 2));
};
m6(1, 2);
m7(2);

//【嵌套函数】


// 调用帧 - call frame
// 调用栈 - call stack
// 尾调用 - tail call
// 尾调用优化 - tail call optimization


// 【尾调用】最后一步调用：
// 不需要存储外层函数的调用帧（调用位置和内部变量都不再用到了）
// 直接替换外层函数调用帧即可
// 【尾调用优化】
const func8 = x => x;
const m8 = x => { return func8(x) };
console.log('m8-result:', m8(8)); //相当于func8(8);


// 【尾递归】尾调用自身
// 递归非常耗内存，因为存储成千上万个调用帧
// 尾递归，因为只存储一个调用帧，所以不会发生栈溢出
// 所以，尾调用优化，对递归操作意义重大

// 【尾递归优化 - 阶乘】
const bad_factorial = n => {
  if (n === 1) return 1;
  return n * bad_factorial(n - 1);
};
const good_factorial = (n, total = 1) => {
  if (n === 1) return total;
  return good_factorial(n -1, n * total);
};
// console.log('bad_factorial-result:', bad_factorial(1000)); // 需要保存n个调用记录，复杂度O(n)
// console.log('good_factorial-result:', good_factorial(1000)); // 尾调用，替换上一个调用记录，只需存1个，复杂度O(1)
// ??????? 实际上都 call stack 溢出 ????????

const bad_fibonacci = n => {
  if(n <= 1) return 1;
  return bad_factorial(n -1) + bad_factorial(n - 2);
};

const good_fibonacci = (n, ac1 = 1, ac2 = 1) => {
  if (n <= 1) return ac2;
  return good_factorial(n - 1, ac2, ac1 + ac2);
};

// console.log('bad_fibonacci-result:', bad_fibonacci(10)); // 需要保存n个调用记录，复杂度O(n)
// console.log('bad_fibonacci-result:', bad_fibonacci(100)); // 需要保存n个调用记录，复杂度O(n)
// console.log('bad_fibonacci-result:', bad_fibonacci(500)); // 需要保存n个调用记录，复杂度O(n)
// console.log('bad_fibonacci-result:', bad_fibonacci(100000)); // 需要保存n个调用记录，复杂度O(n)

// console.log('good_fibonacci-result:', good_fibonacci(10)); // 需要保存n个调用记录，复杂度O(n)
// console.log('good_fibonacci-result:', good_fibonacci(100)); // 需要保存n个调用记录，复杂度O(n)
// console.log('good_fibonacci-result:', good_fibonacci(500)); // 需要保存n个调用记录，复杂度O(n)
// console.log('good_fibonacci-result:', good_fibonacci(100000)); // 需要保存n个调用记录，复杂度O(n)



