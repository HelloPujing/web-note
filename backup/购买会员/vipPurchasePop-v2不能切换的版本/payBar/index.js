import React, { useCallback, useContext, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import useInterval from '@src/utils/useInterval';
import { PAY_CHANNEL } from '@src/pages/vipPurchasePop/const';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import Modal from '@src/widgets/modal';
import networkService from 'Service/networkService';
import Message from '@meijian/message';
import Api from '@src/api';
import { getPayType } from '../util';
import ModalQRCode from './modalQRCode';
import './index.less';


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
  solution, count, discountType, balanceChecked, payChannel,
  moduleName, payTotal,
  initPrice
}) => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};

  const [orderId, setOrderId]/* 订单号 */ = useState('');

  /* 第三方支付 */
  const [modalVisible, setModalVisible]/* 二维码弹窗 */ = useState(false);
  const [content, setContent]/* 第三方支付主体 */ = useState('');
  const [thirdPayAmount, setThirdPayAmount]/* 第三方实际支付精准金额(二维码页面用) */ = useState(0);
  const closeModal/* 关闭弹窗 */ = useCallback(() => {
    setModalVisible(false);
    setOrderId('');
    setContent('');
    setThirdPayAmount(0);
  }, [setModalVisible]);

  /* 全额余额抵扣 */
  const [loading, setLoading] = useState(false);
  const closeLoading/* 关闭loading */ = useCallback(() => {
    setLoading(false);
    setOrderId('');
  }, []);
  useEffect(() => {
    if (loading) Message.loading('订单处理中');
  }, [loading]);

  /* 关闭两种pop */
  const closePops = useCallback(() => {
    if (modalVisible) closeModal();
    if (loading) closeLoading();
  }, [closeLoading, closeModal, loading, modalVisible]);

  /* 刷新页面 */
  const reload = useCallback(msg => {
    Message.error(msg);
    initPrice();
  }, [initPrice]);

  /* 创建订单 */
  const createOrder = throttle(useCallback(() => {
    const shouldThirdPay = payTotal > 0;
    if (shouldThirdPay && !payChannel) { // 未下发第三方渠道
      return Promise.reject({ m: '非常抱歉，当前支付网络不稳定，请联系客服人工处理' });
    }

    const { id: productId } = solution || {};
    const data = {
      productId,
      count,
      discountType,
      useBalance: balanceChecked,
      from: PLATFORM.WEB,
      ...(shouldThirdPay ? { payType: getPayType(payChannel) } : {}),
      ...(shouldThirdPay && payChannel === PAY_CHANNEL.ALI ? { width: 208 } : {})
    };

    return networkService.post({
      url: Api.pay.createMemberOrder,
      data,
      catchError: true
    });
  }, [balanceChecked, count, discountType, payChannel, payTotal, solution]), 3000);

  /* 点击支付 */
  const onClickPay = useCallback(async () => {
    sendMessage(MESSAGES.COLLECT_DATA, { moduleName, key: 'clickPayBtn', info: {} });
    createOrder()
      .then(({ allUseBalance, orderId, content, thirdPayAmount } = {}) => { // payStatus不用管（肯定为已完成，如果发生错误，会以错误码返回）
        if (allUseBalance) { // 用户余额全部抵扣
          setLoading(true);
          setOrderId(orderId);
        } else { // 第三方支付
          setOrderId(orderId);
          setContent(content);
          setThirdPayAmount(thirdPayAmount);
          setModalVisible(true);
        }
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
      });
  }, [sendMessage, MESSAGES.COLLECT_DATA, moduleName, createOrder, reload]);


  /* 轮询检测 */
  const checkOrder = () => {
    if (!orderId) return;

    networkService.post({
      url: Api.pay.checkOrderStatus,
      data: {
        id: orderId
      }
    })
      .then(r => {
        // if (!this.updater.isMounted(this)) return; todo pupuu
        const isGroup = solution && solution.$isGroup;
        switch (r) {
          case 1: // 1:订单完成
          case 3: // 3:订单后台手动设置完成(同1)
            closePops();
            sendMessage(MESSAGES.SUCCESS, { isGroup, usedBalance: balanceChecked });
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

  /* 轮询检测 */
  const shouldClearTick = modalVisible || loading;
  useInterval(checkOrder, shouldClearTick ? ORDER_CHECK_INTERVAL : null);

  return (
    <div styleName="pay-wrapper">
      <div
        styleName="pay-btn"
        onClick={onClickPay}
      >
        购买
      </div>
      {
        modalVisible && (
          <Modal
            visible
            type="frame"
            footer={false}
            closeable
            onCancel={closeModal}
          >
            <ModalQRCode
              payChannel={payChannel}
              thirdPayAmount={thirdPayAmount}
              content={content}
              closeModal={closeModal}
            />
          </Modal>
        )
      }
    </div>
  );
});

export default PayBar;
