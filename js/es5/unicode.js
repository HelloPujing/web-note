/**
 * @desc unicode
 *
 * codePointAt
 *
 */


const unicode2Str = u => {
  console.log(u);
};
unicode2Str('\u661f'); // 星


const str2unicode = str => {
  const unicodes =
    str
      .split('')
      .map(c => c.codePointAt(0).toString(16));
  console.log(unicodes);
};
str2unicode('星期'); // ['661f', '671f']
