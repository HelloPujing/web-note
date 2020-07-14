import React, { useContext, useCallback } from 'react';
import Iconfont from '@src/components/iconfont';
import Modal from '@src/widgets/modal';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import mapContextToProps from '@src/core/mapContextToProps';
import { fmtNumber } from '@src/core/price/utils';
import { userContext } from '@src/components/context/userProvider';
import { DISCOUNT_TYPE } from '@src/const/vip';
import styles from './index.less';

// 产品说，取个人版的discount(规则一致，取最小)
// const getActivitySaleInfo = solutions => {
//   const solution = (solutions || []).find(v => v && !v.$isGroup) || {}; // 个人版
//
//   let minDiscount = 10;
//   let { amount: minSalePrice } = solution || {};
//
//   (solution.discounts || []).forEach(v => {
//     const { $discount: d, value } = v || {};
//     if (d && d > 0 && d < minDiscount) {
//       minDiscount = d;
//       minSalePrice = value;
//     }
//   });
//
//   return { discount: minDiscount, salePrice: minSalePrice };
// };

// 产品改成，固定取团购价
const getActivityPriceText = solutions => {
  const solution = (solutions || []).find(v => v && v.$isGroup) || {}; // 团购版
  const { discounts } = solution || {};
  const discount = (discounts || []).find(v => v && v.type === DISCOUNT_TYPE.GROUP);
  const { value: groupPrice } = discount || {};
  return fmtNumber((groupPrice || 0) / 365, 'ceil', 2);
};

// 带关闭按钮的外壳
const PageFrame = React.memo(({ user, children, step, solutions, duringActivity }) => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};
  const { isVip } = user || {};

  const onClose = useCallback(() => {
    if (step === 3) { // 支付成功页不需要挽留
      sendMessage(MESSAGES.CANCEL);
      return;
    }

    const priceText = getActivityPriceText(solutions);

    const closeDialog = Modal.frame({
      content: (
        <div styleName="leave-modal">
          <i />
          <h6>真的要离开么</h6>
          {
            duringActivity ? (
              <p>限时折扣即将结束！最低{priceText}元/天，享无限方案制作</p>
            ) : (
              <p>
                {
                  isVip
                    ? '您在会员有效期内续费，还能折上再优惠20元哦'
                    : '美间会员让您畅享无限方案制作、高额佣金采购特权'
                }
              </p>
            )
          }
          {

          }
        </div>
      ),
      cancelProps: {
        text: '取消',
        theme: 'blue'
      },
      okProps: {
        text: '狠心离开',
        theme: 'default'
      },
      footerActions: ['ok', 'cancel'],
      onOk: () => {
        sendMessage(MESSAGES.CANCEL);
        closeDialog();
      }
    });
  }, [MESSAGES.CANCEL, duringActivity, isVip, sendMessage, solutions, step]);

  return (
    <div styleName="pay-pop">
      <Iconfont
        className={styles['icon-font-close']}
        id="close"
        size={16}
        onClick={onClose}
      />
      <div styleName="pay-body">
        {children}
      </div>
    </div>
  );
});

export default mapContextToProps(userContext, 'user')(PageFrame);
