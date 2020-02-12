// 定义类型
const fun1 = (a: string, b: string, c: string) => {
    console.log(a, b, c);
};
fun1('xxx', 'yyy', 'zzz');

// 默认参数，放最后
const fun2 = (a: string, b: string, c: string = 'jojo') => {
    console.log(a, b, c);
};
fun2('xxx', 'yyy');

// 可选参数（类似默认参数，可不填，但没值）
// 不能在必选参数后，也要放后边
// 要记得处理可选参数没传时候的处理
const fun3 = (a: string, b?: string, c: string = 'jojo') => {
    console.log(a, b, c);
};
fun3('xxx');

// 扩展运算符同es6


