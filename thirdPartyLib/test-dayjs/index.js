const dayjs = require('dayjs');

// console.log(dayjs()); // 对象
console.log('format', dayjs().format()); // 日期str
console.log('valueOf', dayjs().valueOf()); // 时间戳
console.log('month', dayjs().month() + 1); // 月
console.log('date', dayjs().date()); // 日
console.log('day', dayjs().day()); // 星期X
console.log('second', dayjs().second()); // 秒
console.log('set second', dayjs().second(30)); // 设置秒


