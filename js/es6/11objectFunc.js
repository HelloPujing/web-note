// 【Object.is(x, y)】
// 值相同判断
// 基本和 === 一致
// 唯一区别点：Object.is, 认为NaN和NaN是相同的，认为-0和+0是不同的

const value11 = 'str';
const value12 = 'str';
const obj11 = {};
const obj12 = {};
console.log('obj1:', value11 === value12);
console.log('obj1:', Object.is(value11, value12));
console.log('obj1:', obj11 === obj12);
console.log('obj1:', Object.is(obj11, obj12));
console.log('obj1:', NaN === NaN);
console.log('obj1:', Object.is(NaN, NaN));

// 【Object.assign】

// 【Object.create】
// Object.create(someOtherObj); // 相当于把原型设未someOtherObj, obj.__proto__(someOtherObj)

// 引申:
// __proto__下划线开头，说明是个内部属性，而不是正式对外开放的
// 无论从语义还是兼容性，都不要用，用下边几个更合适：
// 创建 Object.create
// 读  Object.getPrototypeOf
// 写  Object.setPrototypeOf

//【Object.keys】所有键
//【Object.values】所有值
//【Object.entries】
// 所有键值对
// ps: entries另外一个作用是，将对象转为真正的map结构
//【Object.fromEntries】
// entries的逆操作，把键值对还原对象，适合将map结构转对象

const obj2 = {k1: 'v1', k2: 'v2'};
const entries = Object.entries(obj2);
console.log('obj2- to entries', entries);

const obj3 = Object.fromEntries(new Map(entries));
console.log('obj3- from entries', obj3);

// obj ---Object.entries--> array
// obj ---object.entries---> array




