import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './itemPrice.less';

/**
 * @desc 价格条，单位全为元
 *
 */

const propTypes = {
  itemInfo: PropTypes.instanceOf(Object).isRequired
};

class PriceBar extends PureComponent {
  render() {
    const { itemInfo } = this.props;
    const { itemPrice } = itemInfo;

    // 用户单品
    if (Number(itemPrice) === 0) return null;

    return (
      <div styleName="price-bar">
        <div styleName="left-price">
          <span>
            {`¥${itemPrice}`}
          </span>
        </div>
      </div>
    );
  }
}

PriceBar.propTypes = propTypes;

export default PriceBar;
