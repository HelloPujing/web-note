// 最终，应用到美间的

/**
 * 将时间戳转换为特定格式的字符串
 *
 * @param {Number} timestamp 时间戳
 * @param {String} pattern 转换模板，可由如下占位符组合：
 * @return {String} formattedTime 时间转换结果

 *
 * 年(y) 月(M) 日(d)
 * 时(h) 分(m) 秒(s)
 * 毫秒(S)
 *
 *
 * 各占位符数量：1-2个；其中年(y)1-4个，毫秒(S)固定1个(1-3 位数字)
 *
 * @example
 * parseTime(1575878839790, 'yyyy-MM-dd hh:mm:ss') // 2019-12-09 16:07:19
 * parseTime(1575878839790, 'yy年MMM月dd日') // 19年12月09日
 * parseTime(1575878839790, 'hh:mm:ss:S') // 16:07:19:790
 *
 */
function parseTime(timestamp, pattern) {
  const date = new Date(timestamp);
  let fmt = pattern || 'yyyy-MM-dd hh:mm:ss';

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    S: date.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    );
  }

  Object.entries(o).forEach(([k, v]) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : (`00${v}`).substr((`${v}`).length)
      );
    }
  });
  return fmt;
}


console.log(parseTime(1575878839790, 'yy-MM-dd hh:mm:ss'));
