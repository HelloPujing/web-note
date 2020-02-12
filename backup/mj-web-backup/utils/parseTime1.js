// origin
function parseTime1(timestamp, fmt) {
  const d = new Date(timestamp);
  let f = fmt || 'yyyy-MM-dd hh:mm:ss';
  const o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds() // 毫秒
  };
  console.log(o);
  if (/(y+)/.test(f)) {
    f = f.replace(
      RegExp.$1,
      (`${d.getFullYear()}`).substr(4 - RegExp.$1.length)
    );
  }
  Object.entries(o).forEach(([k, v]) => {
    if (new RegExp(`(${k})`).test(f)) {
      f = f.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : (`00${v}`).substr((`${v}`).length)
      );
    }
  });
  return f;
}

console.log(parseTime1(Date.now(), 'yyyy-MM-dd: hh:mm:ss S'));
