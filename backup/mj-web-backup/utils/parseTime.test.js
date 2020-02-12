const parseTime = require('./parseTime.js');

test('默认格式化', () => {
  expect(parseTime(1575878839790))
    .toBe('2019-12-09 16:07:19');
});

test('年月日-', () => {
  expect(parseTime(1575878839790, 'yyyy-MM-dd'))
    .toBe('2019-12-09')
});

test('年月日文案', () => {
  expect(parseTime(1575878839790, 'yy年MM月dd日'))
    .toBe('19年12月09日')
});

test('1位占位符', () => {
  expect(parseTime(1575878839790, 'yy年M月d日'))
    .toBe('19年12月9日')
});
