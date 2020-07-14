import React, { useCallback } from 'react';
import classnames from 'classnames';
// import { Block as Loading } from '@meijian/loading';
import Iconfont from '@src/components/iconfont';
import { PAY_CHANNEL } from '@src/pages/vipPurchasePop/const';
import './index.less';

const AliWechatPay = React.memo(({ children, enableAlipay, enableWechat, payChannel, onChangePayChannel }) => {
  const onClickAlipay = useCallback(() => { onChangePayChannel(PAY_CHANNEL.ALI); }, [onChangePayChannel]);
  const onClickWechat = useCallback(() => { onChangePayChannel(PAY_CHANNEL.WECHAT); }, [onChangePayChannel]);

  return (
    <div styleName="ali-wechat-pay">
      <section styleName="channels">
        <h6>支付方式：</h6>
        {/* 支付宝 */}
        {
          enableAlipay && (
            <div
              styleName={classnames('ali-pay-btn', { active: payChannel === PAY_CHANNEL.ALI })}
              onClick={onClickAlipay}
            >
              <Iconfont
                id="alipay"
                size={20}
              />
              <p>支付宝支付</p>
            </div>
          )
        }
        {/* 微信 */}
        {
          enableWechat && (
            <div
              styleName={classnames('wechat-pay-btn', { active: payChannel === PAY_CHANNEL.WECHAT })}
              onClick={onClickWechat}
            >
              <Iconfont
                id="wechat"
                size={20}
              />
              <p>微信支付</p>
            </div>
          )
        }
      </section>
      {/* 二维码 */}
      <section styleName="two-dimension-code">
        <div styleName="code">
          { children }
        </div>
        {/* { loading && <Loading /> } */}
      </section>
    </div>
  );
});

export default AliWechatPay;
