import React, { useMemo } from 'react';
import Select from '@src/widgets/select';
import { DISCOUNT_TYPE } from '@src/const/vip';
import LabelBar from '@src/pages/vipPurchasePop/step2/comp/labelBar';
import styles from './index.less';

const DiscountBar = React.memo((
  {
    children,
    isGroup,
    discounts,
    discountName,
    discountType,
    onChangeDiscount
  }
) => {
  // 下拉
  const options = useMemo(
    () => discounts.map(({ type: id, name, value }) => ({ value: id, name, payload: { discount: value } })),
    [discounts]
  );

  return (
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
          <span styleName="off-price-value">{children}</span>
        }
      </div>
    </LabelBar>
  );
});

export default DiscountBar;
