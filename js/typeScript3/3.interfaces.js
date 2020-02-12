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
function printPoint(point) {
    console.log(point);
}
printPoint({ x: 1, y: 2 });
function printPoint2(point) {
    var newPoint = { x: 0, y: 0 };
    if (point.x)
        newPoint.x = point.x;
    if (point.y)
        newPoint.y = point.y;
    console.log(newPoint);
}
printPoint2({ x: 1 });
var a = { x: 1, y: 2 };
var arr3 = [1, 2, 3];
var arr3Writable = arr3;
arr3Writable[1] = 2;
console.log(arr3);
function printPoint4(point) {
    console.log(point);
}
printPoint4({ x: 1, y: 2, x1: 3 });
var mySearch;
var mySearch2;
mySearch = function (src, sub) {
    var index = src.search(sub);
    return index > -1;
};
mySearch2 = function (src, sub) {
    var index = src.search(sub);
    return index > -1;
};
var strArr;
strArr = ['1', '2'];
var strObj;
strObj = {
    test: 'str'
};
var Clock = /** @class */ (function () {
    function Clock(h, m) {
    }
    Clock.prototype.setTime = function (d) {
        this.currentTime = d;
    };
    return Clock;
}());
// 接口继承接口
// 接口继承多个接口
// 类继承接口
// 接口继承类
