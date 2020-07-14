import React from 'react';
import LabelBar from '@src/pages/vipPurchasePop/step2/comp/labelBar';
import NumberInput from '@src/pages/vipPurchasePop/step2/comp/numberInput';

const CountBar = React.memo(({ isGroup, min, max, onChangeCount }) => {
  return (
    <>
      {
        isGroup && (
          <LabelBar label="数量：">
            {
              isGroup ? (
                <NumberInput
                  min={min}
                  max={max}
                  defaultCount={min}
                  onChange={onChangeCount}
                />
              ) : '1'
            }
          </LabelBar>
        )
      }
    </>
  );
});

export default CountBar;
