const week = [
  '\u65e5', // 0
  '\u4e00', // 1
  '\u4e8c', // 2
  '\u4e09', // 3
  '\u56db', // 4
  '\u4e94', // 5
  '\u516d' // 6
];

/** （from lxw download）
 * 将时间戳转换为特定格式的字符串
 *
 * 年月日 yyyy-MM-dd
 * 时分秒 HH(24小时制)/hh(12小时制):mm:ss
 * 季度 E
 * 周 q
 *
 * 月 (M)
 * 日 (d)
 * 12 小时 (h)
 * 24 小时 (H)
 * 分 (m)
 * 秒 (s)
 * 周 (E)
 * 季度 (q)
 * 可以用 1-2 个占位符
 *
 * 年 (y) 可以用 1-4 个占位符
 * 毫秒 (S) 只能用 1 个占位符 (是 1-3 位的数字)
 *
 * @param {Number} timestamp 需要转换为字符串的时间戳
 * @param {String} pattern 指示字符串转换的表达式
 */
function dateFormat(timestamp, pattern) {
  let fmt = pattern;
  const date = new Date(timestamp);

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
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

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay()]
    );
  }

  const keys = Object.keys(o);
  for (let index = 0; index < keys.length; index++) {
    const k = keys[index];

    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : `00${o[k]}`.substr(o[k].toString().length)
      );
    }
  }

  return fmt;
}

console.log(dateFormat(Date.now(), 'yyyy-MM-dd: hh:mm:ss EEE'));
