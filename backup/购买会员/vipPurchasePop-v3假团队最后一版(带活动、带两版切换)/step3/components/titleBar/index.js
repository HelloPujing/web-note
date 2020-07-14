import React from 'react';
import './index.less';
import { fmtNumber } from '@src/core/price/utils';

const TitleBar = React.memo(({ title, payAmount: _payAmount }) => {
  const payAmount = fmtNumber(_payAmount, 'round', 2);
  return (
    <div styleName="title-bar">
      <i />
      <h2>{title}</h2>
      {/* 支付金额，为0时不显示 */}
      { Number(payAmount) > 0 && <span>{payAmount}</span> }
    </div>
  );
});

export default TitleBar;
