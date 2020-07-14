import React from 'react';
import { Checkbox } from '@meijian/checkbox';
import Popover from '@src/widgets/popover';
import Iconfont from '@src/components/iconfont';
import { fmtNumber } from '@src/core/price/utils';
import styles from './index.less';

const fmtPrice = price => fmtNumber(price, 'round', 2);

const BalanceBar = React.memo((
  {
    availableMoney,
    balanceChecked,
    canUseBalance,
    onCheckBalance
  }
) => {
  return (
    <div styleName="m-balance">
      <div styleName="check-panel">

        <Checkbox
          // type="single"
          // className={styles['balance-panel-checkbox']}
          checked={balanceChecked}
          disabled={canUseBalance <= 0}
          onClick={onCheckBalance}
          valu=""
          label="使用账户余额抵扣"
        />
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
  );
});

export default BalanceBar;
