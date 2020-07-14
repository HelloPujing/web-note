import React, { useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import useInterval from '@src/utils/useInterval';
import { LOG_MODE, PAY_CHANNEL } from '@src/pages/vipPurchasePop/const';
import networkService from 'Service/networkService';
import Message from '@meijian/message';
import Api from '@src/api';
import { Block as Loading } from '@meijian/loading';
import { getPayType } from '../../util';
import Code from './code';
import BalancePay from './BalancePay';
import AliWechatPay from './AliWechatPay';

const PLATFORM/* 平台 - Android1, iOS2 */ = { WEB: 0 };
const ORDER_CHECK_INTERVAL/*  订单检测间隔 */ = 3000;

/*
*
* 支付控件
* 主要职责：生成订单，生成二维码
* 备注：每次点击，重新获取，不缓存
*
* */
const PayBar = React.memo(({
  solution, count, discountType, couponCode, balanceChecked, payChannel,
  payTotal,
  enableAlipay, enableWechat,
  initData, onChangePayChannel, toStep3
}) => {
  const [orderId, setOrderId]/* 订单号 */ = useState('');
  const [content, setContent]/* 第三方支付主体 */ = useState('');
  // const [thirdPayAmount, setThirdPayAmount]/* 第三方实际支付精准金额(二维码页面用) */ = useState(0);
  const [loadingCode, setLoadingCode]/* 刷新二维码 */ = useState(false);
  const [loadingBalancePay, setLoadingBalancePay]/* 余额支付检测 */ = useState(false);

  const { id: productId } = solution || {};

  /* 关闭两种pop */
  const closePops = useCallback(() => {
    setOrderId('');
    setContent('');
    // setThirdPayAmount(0);
    setLoadingCode(false);
    setLoadingBalancePay(false);
  }, []);

  /* 刷新页面 */
  const reload = useCallback(msg => {
    Message.error(msg);
    initData();
  }, [initData]);

  /* 创建订单 */
  const createOrder = useCallback(throttle(() => {
    const shouldThirdPay = payTotal > 0;
    if (shouldThirdPay && !payChannel) { // 未下发第三方渠道
      return Promise.reject({ m: '非常抱歉，当前支付网络不稳定，请联系客服人工处理' });
    }

    const data = {
      productId,
      count,
      discountType,
      ...(couponCode ? { coupon: couponCode } : {}),
      useBalance: balanceChecked,
      from: PLATFORM.WEB,
      ...(shouldThirdPay ? { payType: getPayType(payChannel) } : {}),
      ...(shouldThirdPay && payChannel === PAY_CHANNEL.ALI ? { width: 160 } : {})
    };

    return networkService.post({
      url: Api.pay.createMemberOrder,
      data,
      catchError: true
    });
  }, 500, { leading: true, trailing: false }), [balanceChecked, count, couponCode, discountType, payChannel, payTotal, productId]);

  /* 创建订单
  * active 主动（点击余额支付按钮）
  * */
  const onCreateOrder = useCallback(active => {
    if ((payTotal <= 0) && !active) return; // 全额余额，点按钮才主动创建订单

    setLoadingCode(true);
    if (LOG_MODE) console.log('创建订单');
    // sendMessage(MESSAGES.COLLECT_DATA, { moduleName, key: 'clickPayBtn', info: {} });
    createOrder()
      .then(({ allUseBalance, orderId, content } = {}) => { // payStatus不用管（肯定为已完成，如果发生错误，会以错误码返回）
        if (allUseBalance) { // 用户余额全部抵扣
          setOrderId(orderId);
          Message.loading('订单处理中'); // 自动关闭
        } else { // 第三方支付
          setOrderId(orderId);
          setContent(content);
          // setThirdPayAmount(thirdPayAmount);
        }
        setLoadingCode(false);
      })
      .catch(({ c, m } = {}) => {
        switch (c) {
          case 705000: // 用户使用会员期续费 但是用户并未再会员期
            reload('您不是会员，无法享受续费折扣，请重新确认购买内容');
            break;
          case 705001: // 用户没有余额充值产品
          case 705002: // 商品不存在或已下架
          case 705005: // 用户余额不够-1
          case 705006: // 用户余额不够-2
            reload('当前页面信息已变更，请重新确认');
            break;
          case 705003: // 小于最小购买份数
          case 705004: // 大于每次最大购买份数
          default:
            Message.error(m);
            break;
        }
        setLoadingCode(false);
      });
  }, [createOrder, payTotal, reload]);

  /* 余额支付点击 */
  const onBalancePay = useCallback(() => {
    setLoadingBalancePay(true);
    onCreateOrder(true);
  }, [onCreateOrder]);

  /* 自动创建订单 */
  useEffect(() => {
    console.log({ balanceChecked, count, couponCode, discountType, payChannel, productId });
    onCreateOrder();
    // eslint-disable-next-line
  }, [balanceChecked, count, couponCode, discountType, payChannel, productId]);

  /* 轮询检测订单状态 */
  const checkOrder = () => {
    if (!orderId) return;

    networkService.post({
      url: Api.pay.checkOrderStatus,
      data: {
        id: orderId
      }
    })
      .then(r => {
        // if (!this.updater.isMounted(this)) return;
        switch (r) {
          case 1: // 1:订单完成
          case 3: // 3:订单后台手动设置完成(同1)
            closePops();
            toStep3({
              count,
              payAmount: payTotal,
              useBalance: balanceChecked
            });
            // thirdPayAmount
            break;
          case 4: // 4:订单支付成功回调发现扣款余额不足 支付发起退款成功
            closePops();
            reload('购买失败，请确认您的美间余额是否充足');
            break;
          case 2: // 2:订单关闭
            closePops();
            reload('订单已关闭，支付失败');
            break;
          case 0: // 0:订单创建待支付回调(也是未完成) 继续查询
          default:
            break;
        }
      });
  };

  // allUseBalance 加状态

  const shouldThirdPay = payTotal > 0 && (enableAlipay || enableWechat);

  /* 轮询检测 */
  const shouldChecking =
    (shouldThirdPay && content && !loadingCode) // 二维码支付，且有，且新
    || (!shouldThirdPay && loadingBalancePay); // 余额支付，且点击
  useInterval(checkOrder, shouldChecking ? ORDER_CHECK_INTERVAL : null);


  if (LOG_MODE) console.log('[payBar] render');

  return (
    <div>
      {
        shouldThirdPay ? ( // 第三方支付
          <AliWechatPay
            enableAlipay={enableAlipay}
            enableWechat={enableWechat}
            payChannel={payChannel}
            onChangePayChannel={onChangePayChannel}
          >
            { loadingCode || !content ? <Loading /> : (
              <Code
                payChannel={payChannel}
                content={content}
                onCreateOrder={onCreateOrder}
              />
            ) }
          </AliWechatPay>
        ) : ( // 余额支付
          <BalancePay onBalancePay={onBalancePay} />
        )
      }
    </div>
  );
});

export default PayBar;
