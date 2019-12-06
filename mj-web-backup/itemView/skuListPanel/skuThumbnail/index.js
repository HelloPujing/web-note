import React from 'react';
import PropTypes from 'prop-types';
import { adapterImgRule } from '@/service/imageRuleStyle';
import './skuThumbnail.less';

const propTypes = {
  skuId/* 同款单品id */: PropTypes.string.isRequired,
  image/* 同款单品图片 */: PropTypes.string.isRequired,
  selected/* 同款单品是否选中 */: PropTypes.bool,
  reloadSkuItemInfo/* 重载同款单品detail，from context */: PropTypes.func
};

const defaultProps = {
  selected: false,
  reloadSkuItemInfo: () => {}
};

const SkuThumbnail = React.memo((props) => {
  const {
    skuId, image, selected, reloadSkuItemInfo: _reloadSkuItemInfo
  } = props;

  const reloadSkuItemInfo = () => {
    if (_reloadSkuItemInfo && skuId) {
      _reloadSkuItemInfo(skuId);
    }
  };

  return (
    <div
      styleName="sku-thumbnail"
      data-selected={selected}
      onClick={reloadSkuItemInfo}
    >
      <div
        styleName="sku-image"
        style={{ backgroundImage: `url(${adapterImgRule('item', 'thumb', image)})` }}
      />
    </div>
  );
});

SkuThumbnail.propTypes = propTypes;
SkuThumbnail.defaultProps = defaultProps;

export default SkuThumbnail;
