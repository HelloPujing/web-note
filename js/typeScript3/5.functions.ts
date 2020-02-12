// 定义类型
const add = (x: number, y: number): number => (x + y);
console.log('x+y:', add(1, 1));

// 可选参数
// 个数必须一致
// 如果个数不一致，要用?代表可选参数，或者设置默认值，但不能同时
// ps:
// 必要参数:string, 默认参数='str', 可选参数?:string
const getName1 = (firstName: string, lastName: string) => `${firstName} ${lastName}`;
const getName2 = (firstName: string, lastName: string = 'Pu') => `${firstName} ${lastName}`;
const getName3 = (firstName: string, lastName?: string) => `${firstName} ${lastName}`;
console.log(getName1('Jing', 'Pu'));
console.log(getName2('Jing'));
console.log(getName3('Jing'));

// 默认参数可以在必填参数前边
const sort = (a:number = 1, b: number): string => `${a} ${b}`;
console.log(sort(undefined, 2));

// 剩余参数
const func1 = (a: string, ...rest: string[]) => {
    return `${a},${rest.join(',')}`
};
console.log(func1('1','2', '3', '4'));

