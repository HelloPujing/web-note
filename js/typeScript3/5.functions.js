// 定义类型
var add = function (x, y) { return (x + y); };
console.log('x+y:', add(1, 1));
// 可选参数
// 个数必须一致
// 如果个数不一致，要用?代表可选参数，或者设置默认值，但不能同时
// ps:
// 必要参数:string, 默认参数='str', 可选参数?:string
var getName1 = function (firstName, lastName) { return firstName + " " + lastName; };
var getName2 = function (firstName, lastName) {
    if (lastName === void 0) { lastName = 'Pu'; }
    return firstName + " " + lastName;
};
var getName3 = function (firstName, lastName) { return firstName + " " + lastName; };
console.log(getName1('Jing', 'Pu'));
console.log(getName2('Jing'));
console.log(getName3('Jing'));
// 默认参数可以在必填参数前边
var sort = function (a, b) {
    if (a === void 0) { a = 1; }
    return a + " " + b;
};
console.log(sort(undefined, 2));
// 剩余参数
var func1 = function (a) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    return a + "," + rest.join(',');
};
console.log(func1('1', '2', '3', '4'));
