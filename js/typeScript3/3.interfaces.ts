/**
 * @desc 接口作用：定义契约
 * 接口可以描述js中对象拥有的各种各样的外形
 * 1.带属性的普通对象
 * 2.函数类型
 * 3.索引类型(数字&字符串2种)
 * 4.类类型
 *
 * 实现接口
 *
 */


// 接口定义
// interface X {}
interface Point {
    x: number,
    y: number
}

function printPoint(point: Point) {
    console.log(point);
}
printPoint({x:1, y:2});


// 可选属性
// ?
interface Point2 {
    x?: number,
    y?: number
}

function printPoint2(point: Point2) {
    const newPoint = {x: 0, y: 0};
    if(point.x) newPoint.x = point.x;
    if(point.y) newPoint.y = point.y;
    console.log(newPoint);
}
printPoint2({x:1});

// 只读属性
// readonly
// ReadonlyArray
// 断言 改变只读
// const vs readonly
// 变量用const, 属性用readonly
interface Point3 {
    readonly x: number,
    readonly y: number
}
const a: Point3 =  {x:1, y:2};
const arr3: ReadonlyArray<number> = [1,2,3];
const arr3Writable = arr3 as number[];
arr3Writable[1] = 2;
console.log(arr3);

// 额外的属性检查
// 如果传入非接口的字段，会报错
// 如果要绕开，就加字符串索引签名
// ps: 如果不是特别复杂的结构，并不建议绕过
interface Point4 {x: number, y: number, [prop: string]: number}
function printPoint4(point: Point4) {
    console.log(point);
}
printPoint4({x:1, y:2, x1:3});

// 函数接口
// 就像函数声明一样，描述参数和返回值
// 下边两个方法的实现，都会检查参数
// search2因为已经定义了类型，所以会推断参数值
interface SearchFunction {
    (source: string, subString: string): boolean
}

let mySearch: SearchFunction;
let mySearch2: SearchFunction;
mySearch = function(src: string, sub: string): boolean {
    let index = src.search(sub);
    return index > -1;
};
mySearch2 = function(src, sub) {
    let index = src.search(sub);
    return index > -1;
};
// mySearch2('aaa', 1);

// 可索引的类型
interface StringArray{
    [index: number]: string
}
let strArr: StringArray;
strArr = ['1', '2'];

interface StringObj {
    [index: string]: string
}
let strObj: StringObj;
strObj = {
    test: 'str'
};

// 类类型
// 公共部分
interface ClockI{
    currentTime: Date;
    setTime(d: Date)
}

class Clock implements ClockI{
    currentTime: Date;
    setTime(d: Date){
        this.currentTime = d;
    }
    constructor(h: number, m: number){ }
}



// 接口继承接口
// 接口继承多个接口
// 类继承接口
// 接口继承类


