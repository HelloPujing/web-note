import React, { useMemo } from 'react';
import classnames from 'classnames';
import { fmtNumber } from '@src/core/price/utils';
import Checkbox from '@src/widgets/checkBox';
import Radio from '@src/widgets/radio';
import Select from '@src/widgets/select';
import Iconfont from '@src/components/iconfont';
import { PAY_CHANNEL } from '@src/pages/vipPurchasePop/const';
import { DISCOUNT_TYPE } from '@src/const/vip';
import Popover from '@src/widgets/popover';
import LabelBar from './labelBar';
import styles from './index.less';

const fmtPrice = price => fmtNumber(price, 'round', 2);

const Total = React.memo(({
  discountName, availableMoney/* 用户余额 */,
  solution, count, discountType, balanceChecked, payChannel, availableChannels,
  priceTotal, costTotal, canUseBalance/* 可抵扣余额 */, payTotal,
  onChangeDiscount, onCheckBalance, onChangePayChannel
}) => {
  // 方案
  const { $isGroup: isGroup, amount, discounts = [] } = solution || {};

  // 支付渠道
  const [enableBalance, enableAlipay, enableWechat] = availableChannels || [];

  // 下拉
  const options = useMemo(
    () => discounts.map(({ type: id, name, value }) => ({ value: id, name, payload: { discount: value } })),
    [discounts]
  );

  return (
    <div styleName="pay-total">
      {/* 原价 */ }
      <LabelBar label="原价：">
        {
          isGroup ? `￥${amount} x ${count} = ￥${priceTotal}` : `￥${amount}`
        }
      </LabelBar>
      {/* 优惠 | 活动 */ }
      <LabelBar label="优惠：">
        <div styleName="m-discount-wrapper">
          {
            isGroup ? ( // 团购 折扣
              <span styleName="discount-by-group">{ discountName }</span>
            ) : ( // 零售 折扣下拉
              <span>
                <Select
                  value={discountType}
                  options={options}
                  className={styles['discount-selector']}
                  onChange={onChangeDiscount}
                />
              </span>
            )
          }
          {/* offTotal */ }
          {
            discountType !== DISCOUNT_TYPE.NONE &&
            <span styleName="off-price-value">立减￥{ priceTotal - costTotal }</span>
          }
        </div>
      </LabelBar>
      {/* 余额抵扣 */ }
      {
        enableBalance && (
          <div styleName="m-balance">
            <div styleName="check-panel">

              <Checkbox
                type="single"
                className={styles.checkbox}
                checked={balanceChecked}
                disabled={canUseBalance <= 0}
                onChange={onCheckBalance}
              >
                使用账户余额抵扣
              </Checkbox>
              <Popover
                popperClass={styles.popover}
                trigger="hover"
                placement="top"
                visibleArrow
                content="美间可提现余额可以抵扣会员购买费用。注：抵扣部分无发票"
              >
                <span styleName="icon-font-wrapper">
                  <Iconfont
                    className={styles['iconfont-check-question']}
                    id="note"
                    size={14}
                  />
                </span>
              </Popover>
            </div>
            <div styleName="balance-info">
              <p styleName="used">可抵￥{ fmtPrice(canUseBalance) }</p>
              <p styleName="hint">
                {
                  availableMoney > 0 ?
                    `(当前余额￥${fmtPrice(availableMoney)}，抵扣后余额为￥${fmtPrice(availableMoney - canUseBalance)})` :
                    '(余额不足)'
                }
              </p>
            </div>
          </div>
        )
      }
      {/* 应付金额 */ }
      <LabelBar label="应付金额：">
        <span styleName="pay-total">￥{ payTotal }</span>
      </LabelBar>
      {/* 支付方式 */ }
      {
        payTotal > 0 && (enableAlipay || enableWechat) && (
          <LabelBar label="支付方式：">
            <div styleName="pay-channel">
              {
              [
                { name: '支付宝支付', value: PAY_CHANNEL.ALI, enable: enableAlipay },
                { name: '微信支付', value: PAY_CHANNEL.WECHAT, enable: enableWechat }
              ]
                .filter(({ enable }) => !!enable)
                .map(({ name, value }) => (
                  <Radio
                    key={value}
                    className={styles.radio}
                    value={value}
                    checked={payChannel === value}
                    onChange={onChangePayChannel}
                  >
                    <Iconfont
                      className={classnames(
                        styles['iconfont-pay-channel'],
                        { [styles[value]]: true }
                      )}
                      data-channel={value}
                      id={value === PAY_CHANNEL.ALI ? 'alipay' : 'wechat'}
                      size={18}
                    />
                    { name }
                  </Radio>
                ))
            }
            </div>
          </LabelBar>
        )}
    </div>
  );
});

export default Total;
