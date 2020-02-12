"use strict";
// 不同类型，会报错
// let t1 = "str2";
// t1 = 124;
// any指定后，不报错
var t2 = "str2";
t2 = 2;
// 类型级
var age = 11;
var closable = true;
var funcType = function () { };
var paramType = function (name) { };
// class Person {
//     name: string;
//     age: number;
// }
// var someone: Person = new Person();
// someone.name = 'Pupuu';
// someone.age = 11;
