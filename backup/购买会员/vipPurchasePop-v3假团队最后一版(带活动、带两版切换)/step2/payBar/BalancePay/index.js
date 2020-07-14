import React, { useCallback } from 'react';
import debounce from 'lodash/debounce';
import './index.less';

const BalancePay = React.memo(({ onBalancePay }) => {
  const onClick = debounce(
    useCallback(
      () => { onBalancePay(true); },
      [onBalancePay]
    ),
    5000,
    {
      leading: true,
      trailing: false
    }
  );
  return (
    <div
      styleName="balance-buy-btn"
      onClick={onClick}
    >
      购买
    </div>
  );
});

export default BalancePay;
