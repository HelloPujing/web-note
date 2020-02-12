/**
 * @desc 单例模式
 * 【思路】
 * 每次来访，都返回同一个实例。
 * 如果一开始实例没有创建，那么需要自行创建实例。
 * 【举例】
 * 在ES6新增的语法Module模块特性，通过import/export导出模块中的变量都是单例的。
 * 全局状态管理模式MobX、Redux等维护的全局状态，react-router等维护的路由实例，等，都属于单例模式。
 * 【实现】
 *
 * 【Reference】
 * http://www.imooc.com/read/38/article/481
 *
 * @param {type} name - desc
 * @param {type} name - desc
 *
 *
 */

let getInstance;

{ // 使用es6通过块级作用域影藏内部变量
  let _instance = null;

  class Singleton {
    name = '';
    constructor(name) {
      this.init(name);
    }
    init(name){
      this.name = name;
      console.log('init~~~~~~ name = ',this.name);
    }
  }

  getInstance = function(){
    if(_instance) return _instance;
    _instance = new Singleton('I am single');
    return _instance;
  }
}

const instance1 = getInstance();
const instance2 = getInstance();
console.log(instance1 === instance2);
