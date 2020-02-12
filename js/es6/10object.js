// 【简写 - 属性】
const x1 = 1;
const obj1 = { x1 };
console.log(`obj1:`, obj1);


// 【简写 - 方法】
const obj2 = {
  m() {}
};
console.log(`obj2:`, obj2);


// 【定义属性】
const obj3 = {};
obj3.normalAttr = 3;
obj3['expressionAttr'] = 3;
const obj4 = {
  ['expressionInObj']: 4
};
console.log(`obj3:`, obj3);
console.log(`obj4:`, obj4);


// 【遍历】
// for...in...
// Object.keys
const obj5 = {
  x: 5,
  y: 5,
  z: 5
};
const array5 = [];
for(const attr in obj5){ array5.push(attr) }
console.log(`obj5:`, array5);
console.log(`obj5:`, Object.keys(obj5));


// ☆☆☆☆☆
// 【扩展运算符】设置属性
const obj6 = {id: 'id', text: 'text'};
const getRequestData = type => {
  return {
    ...(type === 'create'? {} : { id: obj6.id }),
    text: obj6.text
  };
};
console.log('obj6:', getRequestData('edit'));

//
const obj7 = {
  get x(){
    console.log('x');
  }
};
console.log('obj7:', obj7.x);

