import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PriceUtils from '@src/core/price/index';
import withTbkBuy from '@/hoc/withTbkBuy';
import './tbkBuyBtn.less';

/* -----------Tbk Buy Btn------------ */


/**
 * @desc 淘宝客购买按钮；橙色
 * 普通用户：去淘宝购买
 * 佣金用户：去淘宝购买 返￥999
 *
 */

const propTypes = {
  // from HOC
  toTbkBuy: PropTypes.func,
  // props
  // moduleName: PropTypes.string.isRequired,
  short: PropTypes.bool,
  itemInfo: PropTypes.instanceOf(Object)
  // _collectDataBuyItem: PropTypes.func.isRequired
};

const defaultProps = {
  short: false,
  itemInfo: {},
  toTbkBuy: () => {}
};

@withTbkBuy
class TbkBuyBtn extends PureComponent {
  render() {
    const { short, itemInfo, toTbkBuy } = this.props;
    const { commissionRate, itemPrice } = itemInfo || {};

    return (
      <div
        styleName={classnames('tbk-buy-btn', { short })}
        onClick={toTbkBuy}
      >
        <span styleName="buy-text">去淘宝购买</span>
        <span styleName="rebate-text">返¥{PriceUtils.$detailRule.calcRebatePrice(commissionRate, itemPrice)}</span>
      </div>
    );
  }
}

TbkBuyBtn.propTypes = propTypes;
TbkBuyBtn.defaultProps = defaultProps;

export default TbkBuyBtn;
