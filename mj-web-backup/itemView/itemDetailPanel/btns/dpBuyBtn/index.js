import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './dpBuyBtn.less';
import { checkLogin } from '@src/core/userUtils';

/**
 * @desc 直采按钮
 *
 */

const propTypes = {
  navToOrderConfirmPage: PropTypes.func.isRequired
};

class DpBuyBtn extends PureComponent {
  render() {
    const { navToOrderConfirmPage } = this.props;
    const btnText = '立即购买'; // + (isCommissionUser? ` 就赚${calcRebatePrice(dpCommissionRate, formatCurrency(itemInfo.price))}` : '')

    const handleClick = () => {
      if (!checkLogin()) return;
      navToOrderConfirmPage();
    };
    return (
      <div
        styleName="dp-buy-btn"
        onClick={handleClick}
      >
        {btnText}
      </div>
    );
  }
}

DpBuyBtn.propTypes = propTypes;

export default DpBuyBtn;
