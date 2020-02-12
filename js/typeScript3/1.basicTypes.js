var isDone = false;
console.log(isDone);
var decLiteral = 6;
var hexLiteral = 0xf00d;
var binaryLiteral = 10;
var octalLiteral = 484;
console.log(decLiteral, hexLiteral, binaryLiteral, octalLiteral);
var myName = 'str';
console.log(myName);
// Array
var list = [1, 2];
var list2 = [1, 2];
console.log(list, list2);
// Tuple
var x;
x = ['x', 1];
// x[4] = 'four';
console.log('越界元素使用已定义的联合类型');
// console.log(x, x[0], x[4]);
// Enum
var PAY_TYPE;
(function (PAY_TYPE) {
    PAY_TYPE[PAY_TYPE["ali"] = 1] = "ali";
    PAY_TYPE[PAY_TYPE["wecaht"] = 2] = "wecaht";
})(PAY_TYPE || (PAY_TYPE = {}));
console.log(PAY_TYPE.ali, PAY_TYPE.wecaht);
var type = 2;
console.log(PAY_TYPE[type]);
// Any
var listAny = [1, 'str', true];
console.log(listAny);
// Void
function returnNull() {
    console.log('return void');
}
returnNull();
var unusable = undefined;
var unusable2 = null;
console.log(unusable, unusable2);
// Null Undefined
console.log('null undefined 是所有类型的子类型，可以赋值给任意类型');
// Never
function error(m) {
    throw new Error(m);
}
// function infiniteLoop(): never{
// while (true){
// }
// }
// 返回never的函数必须存在无法达到的终点
// Object
// declare function create(o: object | null): void;
// Assert
// 相当于强制类型转换
var someValue = 'some value';
var l1 = someValue.length;
var l2 = someValue.length;
var l3 = someValue.length;
console.log(l1, l2, l3);
