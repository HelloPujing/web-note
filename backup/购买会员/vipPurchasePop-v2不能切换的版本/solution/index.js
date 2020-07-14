import React from 'react';
import Message from '@meijian/message';
import { DISCOUNT_TYPE } from '@src/const/vip';
import { isNumInLimit } from '../util';
import NumberInput from './numberInput';
import ConnerNode from './connerNode';
import './index.less';


const Solution = React.memo(({
  active = false,
  initDiscountType, // 初始化活动类型，决定角标和价格的显示用
  solution,
  groupCount,
  onChangeSolution, onChangeCount
}) => {
  const { $isGroup: isGroup, title, discounts, amount, minBuyLimitCount: min, maxBuyLimitCount: max } = solution || {};

  const onSubtract = () => {
    onChangeCount(groupCount - 1);
  };
  const onAdd = () => {
    onChangeCount(groupCount + 1);
  };
  const onChange = e => {
    const { value } = e.target;
    if ((/^[0-9]*$/.test(value) && value.length < 3) || !value) {
      onChangeCount(Number(value));
    }
  };
  const onBlur = () => {
    const [inLimit, fmtNum] = isNumInLimit(groupCount, min, max);
    if (!inLimit) {
      Message.error(`单次购买允许${min}～${max}份。可多次购买`);
      onChangeCount(fmtNum);
    }
  };

  // 角标
  const discountInfo = (discounts || []).find(({ type }) => type === initDiscountType);
  const { $discount, type, value: salePrice } = discountInfo || [];
  const tagTitle = `${isGroup ? '团购' : (type === DISCOUNT_TYPE.CONTINURATION ? '续费' : '限时')}${$discount}折`;

  return (
    <div
      styleName={`card ${active ? 'active' : ''}`}
      onClick={onChangeSolution}
    >
      {/* 角标 */}
      <ConnerNode active={active} title={tagTitle} isGroup={isGroup} />
      <p>{title}</p>
      <div styleName="price-bar">
        <span>￥{salePrice}</span>
        <span>￥{amount}{isGroup ? '/人' : ''}</span>
      </div>
      {/* 团购数量 */}
      {
        isGroup && (
          <NumberInput
            active={active}
            min={min}
            max={max}
            groupCount={groupCount}
            onSubtract={onSubtract}
            onAdd={onAdd}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                e.target.blur();
                onBlur();
              }
            }}
            onChange={onChange}
            onBlur={onBlur}
          />
        )
       }
    </div>
  );
});

export default Solution;
