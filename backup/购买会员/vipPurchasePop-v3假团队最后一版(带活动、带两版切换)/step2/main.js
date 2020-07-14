import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
// import Message from '@meijian/message';
import { Embed as EmbedLoading } from '@meijian/loading';

import networkService from 'Service/networkService';
import { defineUseModuleName } from '@src/core/point';
// import setStateAsync from '@src/core/setStateAsync';
import { fmtNumber } from '@src/core/price/utils';
import Api from '@src/api';

import { PAY_CHANNEL } from '../const';
import {
  getInitDiscountType,
  fmtAvailableMoney, getAvailableChannels
} from '../util';
import LabelBar from './comp/labelBar';
import CountBar from './countBar';
import DiscountBar from './discountBar';
import CouponBar from './couponBar';
import BalanceBar from './balanceBar';
import PayBar from './payBar';

import styles from './main.less';


/**
 * @desc 会员购买页面
 *
 */

const Main = ({ moduleName, isVip, solution, toStep3 }) => {
  const [loading, setLoading] /* 主数据是否获取 - 余额、动态下发 */ = useState(true);
  const [availableMoney, setAvailableMoney] /* 余额 */ = useState(0);
  const [coupons, setCoupons] /* 优惠券（20元抵扣券） */ = useState([]);
  const [availableChannels, setAvailableChannels] /* 3种下发渠道是否可用 - [余额、支付宝、微信] */= useState([false, false, false]);

  // 方案数据 加index
  // 交互数据
  const [groupCount, setGroupCount] /* 购买数量 - 普通数量固定1，团购数量2-30，如果多个团购要移到solutions下 */ = useState(2);
  const onChangeCount /* 修改团购数量 */ = debounce(newCount => setGroupCount(newCount), 1000, { leading: false, trailing: true });

  const [discountType, setDiscountType] /* 折扣类型 - 1~3 会员续费2，非会员活动1 */ = useState(1);
  const onChangeDiscount = id => setDiscountType(id);

  const [couponCode, setCouponCode] /* 优惠券码 - code 或者 0(不使用) */ = useState(0);

  const [balanceChecked, setBalanceChecked] /* 是否使余额 */ = useState(false);
  const onCheckBalance /* 勾选使用余额 */ = () => setBalanceChecked(!balanceChecked);

  const [payChannel, setPayChannel] /* 支付渠道 - 需根据动态下发重新初始化 */ = useState(undefined);

  /* 获取信息 */
  const initData = useCallback(async () => {
    setLoading(true);

    let availableMoney;
    let availableChannels;
    let coupons;
    let couponCode;

    // 如果后续，还是得刷新solutions, 此处追加api task

    // 余额
    try {
      const account = await networkService.post({ url: Api.finance.accountDetail });
      const { availableMoney: _m } = account || {};
      availableMoney = fmtAvailableMoney(_m || 0);
    } catch (e) {
      console.error(e);
    }

    // 下发的支付渠道
    try {
      const _channels = await networkService.post({ url: Api.pay.getAvailableChannel });
      availableChannels = getAvailableChannels(_channels || []);
    } catch (e) {
      console.error(e);
    }

    // 优惠券
    try {
      const MEMBER_COUPON_TYPE = 1;
      const data = { type: MEMBER_COUPON_TYPE }; // 会员类型优惠券
      const _coupons = await networkService.post({ url: Api.user.getRemainderCouponList, data });
      // 优惠券列表
      coupons = (_coupons || []).filter(v => v && v.type === MEMBER_COUPON_TYPE); // 过滤无效值
      // 默认选中优惠券(第一张金额最大、即将过期)
      const defaultCoupon = coupons[0];
      couponCode = defaultCoupon ? defaultCoupon.code : 0;
    } catch (e) {
      console.error(e);
    }

    const [, enableAlipay, enableWechat] = availableChannels || [];
    const initDiscountType = getInitDiscountType(isVip, solution.discounts); // 个人版 默认优惠类型

    // 重置所有信息
    // 避免支付错误后再次请求价格时，某些信息不对称
    // 譬如，团购出错，重置时，i变更，原discountType在新solution中不存在
    setAvailableMoney(availableMoney);
    setCoupons(coupons);
    setAvailableChannels(availableChannels);

    setGroupCount(2);
    setDiscountType(initDiscountType);
    setCouponCode(couponCode);
    setBalanceChecked(false);
    setPayChannel(enableAlipay ? PAY_CHANNEL.ALI : (enableWechat ? PAY_CHANNEL.WECHAT : undefined));

    setLoading(false);
  }, [isVip, solution.discounts]);

  useEffect(() => {
    initData();
  }, [initData, solution]);


  if (!solution) return <EmbedLoading show className={styles.loading} />;

  // 加载
  if (loading) return <EmbedLoading show className={styles.loading} />;

  // 方案
  const { $isGroup, amount, discounts, minBuyLimitCount: min, maxBuyLimitCount: max } = solution || {};
  const count = $isGroup ? groupCount : 1;

  // 支付渠道
  const [enableBalance, enableAlipay, enableWechat] = availableChannels || [];

  // 折扣 0.88|0.5|1
  const discountObj = (discounts || []).find(({ type }) => type === discountType);
  // 优惠券
  const coupon = (coupons || []).find(({ code } = {}) => code === couponCode);
  const { award } = coupon || {};
  const _couponAmount = award || 0;

  if (!discountObj) return <EmbedLoading show className={styles.loading} />; // 切换方案，会导致原类型不存在

  const { name: discountName = '', value: salePrice } = discountObj || {};

  // 核心价格
  const originTotal/* 参考价总价 */ = amount * count;
  const salesTotal/* 折扣后实际总价 */ = salePrice * count;
  const couponOff/* 优惠券抵扣，算实际抵扣 */ = salesTotal > _couponAmount ? _couponAmount : salesTotal; // 如果券额超过要付的金额，显示支付额

  const costTotal/* 需要付出的钱（包括余额和第三方） */ = (salesTotal - couponOff) > 0 ? salesTotal - couponOff : 0;
  const canUseBalance/* 最多抵扣余额 */ = availableMoney > costTotal ? costTotal : availableMoney;
  const payTotal/* 第三方支付 */ = costTotal - (balanceChecked ? canUseBalance : 0);

  return (
    <>
      {/* 结算 */}
      <div styleName="pay-total">
        {/* 数量 */}
        <CountBar
          isGroup={$isGroup}
          min={min}
          max={max}
          onChangeCount={onChangeCount}
        />
        {/* 原价; 整数元 */ }
        <LabelBar label="原价：">{ $isGroup ? `￥${amount} x ${count} = ￥${fmtNumber(originTotal, 'floor', 2)}` : `￥${amount}` }</LabelBar>
        {/* 优惠 | 活动; 整数元 */ }
        <DiscountBar
          isGroup={$isGroup}
          discounts={discounts}
          discountName={discountName}
          discountType={discountType}
          onChangeDiscount={onChangeDiscount}
        >
          立减￥{ fmtNumber(originTotal - salesTotal, 'floor', 2) }
        </DiscountBar>
        {/* 券; 整数元 */ }
        {
            coupons
            && coupons.length > 0
            && (
              <CouponBar
                couponCode={couponCode}
                coupons={coupons}
                onChangeCoupon={setCouponCode}
              >
                额外减￥{ fmtNumber(couponOff, 'floor', 2) }
              </CouponBar>
            )
          }
        {/* 余额抵扣 */ }
        {
            enableBalance && (
              <BalanceBar
                availableMoney={availableMoney}
                balanceChecked={balanceChecked}
                canUseBalance={canUseBalance}
                onCheckBalance={onCheckBalance}
              />
            )
          }
        {/* 应付金额 */ }
        <LabelBar label="应付金额：">
          <span styleName="pay-total">￥<em>{ fmtNumber(payTotal, 'round', 2) }</em></span>
        </LabelBar>
        <div styleName="segmentation-line" />
      </div>
      {/* 支付 */}
      <PayBar
        moduleName={moduleName} // 该版本没用

        solution={solution}
        count={count}
        discountType={discountType}
        couponCode={couponCode}
        balanceChecked={balanceChecked}
        payChannel={payChannel}

        payTotal={payTotal}
        enableAlipay={enableAlipay}
        enableWechat={enableWechat}
        initData={initData}
        onChangePayChannel={setPayChannel}
        toStep3={toStep3}
      />
    </>
  );
};

export default defineUseModuleName(Main);
