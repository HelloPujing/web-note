import React, { useCallback, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import { PAY_CHANNEL } from '@src/pages/vipPurchasePop/const';
import './index.less';

/*
* 二维码弹窗体
* 时效：1小时，过期自动关闭弹窗
* 轮询：查询订单状态
* */
const TIMEOUT_DURATION/* 二维码过期时间 */ = 60000 * 60;

const ScanPayQRCode = React.memo(props => {
  const {
    payChannel/* 支付渠道 */,
    thirdPayAmount/* 第三方支付金额 */,
    content/* 支付码 */,
    closeModal/* 关闭二维码弹窗 */
  } = props;

  /* 超时关闭pop */
  useEffect(() => {
    setTimeout(closeModal, TIMEOUT_DURATION);
  }, [closeModal]);

  /* 设置支付宝二维码iframe */
  const iframeEl = useRef();

  const _insertAliScript = useCallback(() => {
    if (!iframeEl.current || !content) {
      console.error('支付宝载入脚本失败：无实体或无支付码信息');
      return;
    }

    const { contentDocument } = iframeEl.current || {};
    contentDocument.open();
    contentDocument.write(
      `<script>setTimeout(function(){document.body.style.overflow = 'hidden'}, 2000)</script>${
        content
      }`
    );
    contentDocument.close();
  }, [content]);

  useEffect(() => {
    if (payChannel === PAY_CHANNEL.ALI) {
      _insertAliScript();
    }
  }, [_insertAliScript, payChannel]);

  if (!content) return null;

  return (
    <div styleName="scan-for-pay">
      {/* 标题 */ }
      <p styleName="title">
        { payChannel === PAY_CHANNEL.WECHAT ? '微信' : '支付宝' }扫码付款￥{ thirdPayAmount }
      </p>
      {/* 支付码 */ }
      <div styleName="qr-wrapper">
        {
          payChannel === PAY_CHANNEL.WECHAT ? (
            <QRCode value={content} size={208} />
          ) : (
            <iframe
              title="content"
              ref={iframeEl}
            />
          ) }
      </div>
    </div>
  );
});

export default ScanPayQRCode;
