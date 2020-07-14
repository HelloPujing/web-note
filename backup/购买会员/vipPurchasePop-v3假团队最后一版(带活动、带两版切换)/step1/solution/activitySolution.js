import React, { useState } from 'react';
import { DISCOUNT_TYPE, SOLUTION_TYPE } from '@src/const/vip';
import { getInitDiscountType } from '@src/pages/vipPurchasePop/util';
import { fmtNumber } from '@src/core/price/utils';
import ConnerNode from './connerNode';
import HelpIcon from './helpIcon';
// import './activitySolution.less';
import styles from './activitySolution.less';
// className={isGroup ? styles['group-conner'] : styles['single-conner'] }


const Solution = React.memo(({
  isVip, solution,
  onChangeSolution, onClick
}) => {
  // props
  const { type: solutionType, discounts, amount, minBuyLimitCount } = solution || {};
  const isGroup = solutionType === SOLUTION_TYPE.GROUP;

  // 售价，取活动中，价格小的
  const initDiscountType = getInitDiscountType(isVip, solution.discounts); // 个人版 默认优惠类型
  // 角标
  const discountInfo = (discounts || []).find(({ type }) => type === initDiscountType);
  const { $discount, type, value: salePrice } = discountInfo || [];
  const tagTitle = `${isGroup ? '团购' : (type === DISCOUNT_TYPE.CONTINURATION ? '续费' : '限时')}${$discount}折`; // 个人限时、团购，都显示限时

  // 悬浮tip
  const [hovered, setHovered] = useState(false);

  return (
    <div
      styleName="card"
      data-is-group={isGroup}
      onClick={onChangeSolution}
    >
      {/* 角标 */}
      <ConnerNode title={tagTitle} className={styles.conner} />
      {/* title */}
      <div styleName="title">
        {
          isGroup ? (
            <>
              <span>团队购买</span>
              <HelpIcon />
            </>
          ) : (<span> 个人购买 </span>)
        }
      </div>
      {/* 两行价格 */}
      <div styleName="main">
        <div styleName="price-bar">¥ <em>{salePrice}</em>{ isGroup ? '/人/年' : '/年'}</div>
        <div styleName="delete-price-bar">¥ {amount}/年</div>
      </div>
      {/* 购买按钮 */}
      <div
        styleName="buy-btn"
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        立即购买
        {/* （<i>￥</i>{ */}
        {/* isGroup */}
        {/*  ? `${minBuyLimitCount * salePrice}起` */}
        {/*  : salePrice */}
        {/* }） */}
      </div>
      <p styleName="note">{isGroup ? `${minBuyLimitCount}人起购价更优` : `折合${fmtNumber(salePrice / 365, 'ceil', 2)}元/天`}</p>
      {/* 说明框 */}
      {
        isGroup && hovered && (
          <div styleName="tip">
            <h6>会员购买</h6>
            <p>1、团队购买美间会员，2个起售，每人每年229元；</p>
            <p>2、完成支付后，在右上角的“个人中心”中打开“我的账户-会员购买记录”来查看兑换码；</p>
            <p>3、登录需要兑换的账户，在右上角的“个人中心”中打开“我的会员”，在“兑换码”输入框中输入兑换码，进行会员兑换。</p>
          </div>
        )
      }
    </div>
  );
});

export default Solution;
