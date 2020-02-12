let isDone: boolean = false;
console.log(isDone);

let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
console.log(decLiteral, hexLiteral, binaryLiteral, octalLiteral);

let myName: string = 'str';
console.log(myName);

// Array
let list: number[] = [1, 2];
let list2: Array<number> = [1, 2];
console.log(list, list2);

// Tuple
let x: [string, number];
x = ['x', 1];
// x[4] = 'four';
console.log('越界元素使用已定义的联合类型');
// console.log(x, x[0], x[4]);

// Enum
enum PAY_TYPE {ali = 1, wecaht}
console.log(PAY_TYPE.ali, PAY_TYPE.wecaht);
const type = 2;
console.log(PAY_TYPE[type]);

// Any
let listAny: any[] = [1, 'str', true];
console.log(listAny);

// Void
function returnNull(): void{
    console.log('return void');
}
returnNull();
let unusable: void = undefined;
let unusable2: void = null;
console.log(unusable, unusable2);

// Null Undefined
console.log('null undefined 是所有类型的子类型，可以赋值给任意类型');

// Never
function error(m: string): never {
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
const someValue: any = 'some value';
const l1: number = someValue.length;
const l2: number = (<string>someValue).length;
const l3: number = (someValue as string).length;
console.log(l1, l2, l3);

