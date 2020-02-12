
// 不同类型，会报错
// let t1 = "str2";
// t1 = 124;

// any指定后，不报错
let t2: any = "str2";
t2 = 2;

// 类型级
let age: number = 11;
let closable: boolean = true;
let funcType = ():void => {};
let paramType = (name: string) => {};

// class Person {
//     name: string;
//     age: number;
// }

// var someone: Person = new Person();
// someone.name = 'Pupuu';
// someone.age = 11;
