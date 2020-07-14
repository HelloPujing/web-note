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

const Code = React.memo(props => {
  const {
    payChannel/* 支付渠道 */,
    content/* 支付码 */,
    onCreateOrder
  } = props;

  /* 超时刷新 */
  useEffect(() => {
    let tick;
    if (content) {
      tick = setTimeout(() => {
        console.log('[二维码超时] 1小时，重新生成二维码');
        onCreateOrder();
      }, TIMEOUT_DURATION);
      // console.log('[二维码超时] 重新计时', tick);
    }
    return () => {
      // console.log('[二维码超时] clear timeout', tick);
      window.clearTimeout(tick);
    };
  }, [content, onCreateOrder]);

  /* 设置支付宝二维码iframe */
  const iframeEl = useRef();

  const _insertAliScript = useCallback(() => {
    if (!iframeEl.current || !content) {
      console.error('支付宝载入脚本失败：无实体或无支付码信息');
      return;
    }

    const { contentDocument } = iframeEl.current || {};
    if (!contentDocument) return;

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
    <div styleName="qr-wrapper">
      {
        payChannel === PAY_CHANNEL.WECHAT
        && content.indexOf('weixin') > -1
        && (
          <QRCode value={content} size={160} />
        )
      }
      {
        payChannel === PAY_CHANNEL.ALI
        && content.indexOf('form') > -1
        && (
          <iframe
            title="content"
            ref={iframeEl}
          />
        )
      }
    </div>
  );
});

export default Code;
