import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tag from '@src/components/tag/index';
import { BRAND_ITEM_SALE_TYPE } from '@/service/promotion/dpService';
import './nameBar.less';

const propTypes = {
  name: PropTypes.string.isRequired,
  brandItemType: PropTypes.string.isRequired
};

class NameBar extends PureComponent {
  render() {
    const { name, brandItemType } = this.props;
    let showTag = false;
    let tagType;

    switch (brandItemType) {
      case BRAND_ITEM_SALE_TYPE.TBK:
      case BRAND_ITEM_SALE_TYPE.DP_TBK:
        // 淘宝客标签，不区分认证情况，都显示
        showTag = true;
        tagType = 'tbk';
        break;
      case BRAND_ITEM_SALE_TYPE.DP:
        // 直采标签，不区分认证情况，都显示
        showTag = true;
        tagType = 'dp';
        break;
      default:
        break;
    }

    return (
      <h1 styleName="item-name">
        {showTag ? (
          <span styleName="tag-wrapper">
            <Tag type={tagType} size="big" />
          </span>
        ) : null}
        {name}
      </h1>
    );
  }
}

NameBar.propTypes = propTypes;

export default NameBar;
