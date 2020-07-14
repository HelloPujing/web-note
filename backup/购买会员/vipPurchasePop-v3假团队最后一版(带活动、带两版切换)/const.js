// 付款渠道, 同埋点info字段
export const PAY_CHANNEL = {
  ALI: 'ali',
  WECHAT: 'wechat'
};

// 支付方式
export const PAY_TYPE = {
  ALIPAY_UNIFIEDORDER: 1, // (1, "支付宝", "统一下单"),//兼容旧码
  // ALIPAY_APP: 11, // (11, "支付宝", "手机支付"),
  // ALIPAY_APP_H5: 12, // (12, "支付宝", "H5支付"),
  ALIPAY_PC_UNIFIEDORDER: 13, // (13, "支付宝", "PC统一下单"),
  // ALIPAY_APP_UNIFIEDORDER: 14, // (14, "支付宝", "APP统一下单"),
  // ALIPAY_H5_UNIFIEDORDER: 15, // (15, "支付宝", "H5统一下单"),
  WEIXIN_UNIFIEDORDER: 2, // (2, "微信", "统一下单"),//兼容旧码
  // WEIXIN_APP: 21, // (21, "微信", "手机支付"),
  // WEIXIN_H5: 22, // (22, "微信", "H5支付"),
  WEIXIN_PC_UNIFIEDORDER: 23 // (23, "微信", "PC统一下单"),
  // WEIXIN_APP_UNIFIEDORDER: 24, // (24, "微信", "APP统一下单"),
  // WEIXIN_H5_UNIFIEDORDER: 25, // (25, "微信", "H5统一下单"),
  // WEIXIN_MP: 26 // (26, "微信", "小程序支付"),
  // 101 :MJ_BALANCE 美间余额支付 // 不需要明确传，已经有useBalance字段了
};


export const LOG_MODE = false;
