import { DISCOUNT_TYPE, SOLUTION_TYPE } from '@src/const/vip';
import { PAY_CHANNEL, PAY_TYPE } from '@src/pages/vipPurchasePop/const';
import { fmtNumber } from '@src/core/price/utils';

/*
* 获取初始化折扣类型
* 【个人版】
* 1.选价格低的类型
* 2.如果'续费'和'活动'价格一样低，选择续费类型
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

/*
* 数据加工 solutions
* 每项方案：
* 新增$isGroup字段
* 处理优惠活动discounts的数据
*
* */
export const fmtSolution = (solutions, isVip) => {
  return (solutions || []).map(_solution => {
    const solution = { ..._solution };
    const { type, amount } = _solution || [];
    // 1 团购标识
    const isGroup = type === SOLUTION_TYPE.GROUP;
    solution.$isGroup = isGroup;
    // 1.1 处理每个方案，不同折扣的选项名称
    solution.discounts = (_solution.discounts || []).map(({ type, name, value: salePrice }) => {
      const discount = fmtNumber(salePrice / amount * 10, 'ceil', 1);
      return ({
        type,
        $discount: discount,
        name: `${name}${discount}折`,
        value: salePrice
      });
    });
    // 1.2 非会员，删除续费项
    const i = solution.discounts.findIndex(discount => discount && discount.type === DISCOUNT_TYPE.CONTINURATION);
    if (!isVip && i > -1) solution.discounts.splice(i, 1);
    // 1.3 非团购：填充'不使用优惠'首选项
    if (!isGroup && _solution.discounts) {
      solution.discounts.unshift({ type: DISCOUNT_TYPE.NONE, name: '不使用优惠', value: amount });
    }
    return solution;
  });
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
