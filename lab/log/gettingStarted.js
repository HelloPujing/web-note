// 日志分级
// 日志分类
// 日志落盘

// logger
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.debug('Timer:', new Date());

// 日志优先级从低到高如下
// 调用一下方法的同时，相当于已经定了级
// trace
// debug
// info
// warn
// error
// fatal
// mark

//
//
