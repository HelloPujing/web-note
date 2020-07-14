import { PAY_CHANNEL, PAY_TYPE } from '@src/pages/vipPurchasePop/const';

/*
* 获取初始化折扣类型
* 【个人版】
* 1.选价格低的类型
* 2.如果'续费'和'活动'价格一样低，选择续费类型 // todo Pupuu 以后这种逻辑让服务端加权重字段
* 【团购版】
* 只有1个，但和个人版一样的流程，选价格低的
*
* */
export const getInitDiscountType = (isPro, _discounts) => {
  const discounts = _discounts || [];
  let minDiscountO = { $discount: 10 };

  discounts.forEach(v => {
    const { $discount } = v || {};
    if ($discount <= minDiscountO.$discount) minDiscountO = v; // 1.如果是10，也要导入正常数据；2.续费=活动时，要显示续费，所以要替换
  });

  return minDiscountO.type;
};

/**
 * @desc 数据加工 availableChannels
 * @param {array} channelKeys - 可用渠道列表，服务端字段
 * @return {array} channels - 3种渠道[支付宝，微信，余额抵扣]分别是否可用
 * @example
 * [1, 2, 10 ] -> [true, true, true]
 * [1, 2 ]     -> [false, true, true]
 * [10]        -> [true, false, false]
 */
export const getAvailableChannels = channelKeys => {
  const AVAILABLE_CHANNELS = { ALI: 1, WECHAT: 2, BALANCE: 10 };
  const channels = new Array(3).fill(false);
  (channelKeys || [])
    .forEach(key => {
      switch (key) {
        case AVAILABLE_CHANNELS.BALANCE:
          channels[0] = true;
          break;
        case AVAILABLE_CHANNELS.ALI:
          channels[1] = true;
          break;
        case AVAILABLE_CHANNELS.WECHAT:
          channels[2] = true;
          break;
        default:
          break;
      }
    });
  return channels;
};

/*
*  数据处理 availableMoney
* */
export const fmtAvailableMoney = money => (money > 0 ? money : 0);

/*
*  限制数字
* */
export const isNumInLimit = (n, min, max) => {
  let inLimit;
  let fmtNum;

  switch (true) {
    case typeof n !== 'number':
    case n < min:
      inLimit = false; fmtNum = min; break;
    case n > max:
      inLimit = false; fmtNum = max; break;
    default:
      inLimit = true; fmtNum = n; break;
  }
  return [inLimit, fmtNum];
};

/*
* payChannel 映射到服务端 payType
* */
export const getPayType = payChannel => {
  switch (payChannel) {
    case PAY_CHANNEL.ALI:
      return PAY_TYPE.ALIPAY_PC_UNIFIEDORDER;
    case PAY_CHANNEL.WECHAT:
      return PAY_TYPE.WEIXIN_PC_UNIFIEDORDER;
    default:
      return '';
  }
};
