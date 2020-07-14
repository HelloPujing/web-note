import React, { useMemo } from 'react';
import Select from '@src/widgets/select';
import LabelBar from '@src/pages/vipPurchasePop/step2/comp/labelBar';
import styles from './index.less';

const CouponBar = React.memo((
  {
    children,
    coupons,
    couponCode,
    onChangeCoupon
  }
) => {
  // 下拉
  const options = useMemo(() => {
    const options = coupons.map(({ code: id, name }) => ({ value: id, name }));
    options.unshift({ value: 0, name: '不使用优惠' }); // !
    return options;
  }, [coupons]);

  return (
    <LabelBar label="券：">
      <div styleName="m-coupon-wrapper">
        <Select
          value={couponCode}
          options={options}
          className={styles['coupon-selector']}
          onChange={onChangeCoupon}
        />
        {/* offTotal */ }
        {
          couponCode ? <span styleName="off-price-value">{children}</span> : null
        }
      </div>
    </LabelBar>
  );
});

export default CouponBar;
