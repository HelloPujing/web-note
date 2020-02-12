import React from 'react';
import PubSub from 'Service/pubSub';
import { checkLogin, openAuthModal } from '@src/core/userUtils';
import { collectData } from '@src/core/point';
import autoCollectBrand from '@src/core/brand/autoCollectBrand';
import { USER_ROLE } from 'Service/constService';
import './index.less';

/**
 * @desc 下载按钮
 *
 */
const DownloadBtn = React.memo(({
  moduleName,
  info/* 单品详情 */,
  activeIndex/* 多图当前索引 */,
  _analyze/* 友盟埋点 */
}) => {
  // 下载图片
  const downloadImg = () => {
    _analyze({ category: 'ItemDetail', action: 'DownloadItemImage', label: '' });

    const dataInfo = {
      itemId: info.id || ''
    };
    if (info.skuId > 0) {
      Object.assign(dataInfo, { skuId: info.skuId });
    }

    PubSub.publish('loadHD', {
      type: 'item',
      definition: 'normal',
      imageIndex: activeIndex,
      itemInfo: info
    });
  };

  /**
   * @desc 点击图片下载
   *
   */
  const onClickDownload = async () => {
    const { id: itemId, owner } = info || {};

    collectData({
      moduleName,
      key: 'downloadItemImage',
      info: { itemId }
    });

    // 登录
    if (!checkLogin()) return;

    // 资料填写
    if (!openAuthModal({ moduleFrom: moduleName })) return;

    // 自动订阅
    const isBrandItem = owner && owner.type === USER_ROLE.BRAND;
    const brandContainerId = isBrandItem ? owner && owner.id : ''; // 品牌页ID, 可能为空(用户)

    autoCollectBrand({
      brandContainerId,
      cb: downloadImg
    });
  };

  return (
    <div styleName="load-down" onClick={onClickDownload} data-title="下载" />
  );
});

export default DownloadBtn;
