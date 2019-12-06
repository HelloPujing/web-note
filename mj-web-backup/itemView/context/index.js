import React from 'react';

export const ItemInfoContext = React.createContext({
  reloadItemInfo/* 重新加载当前单品信息 */: () => {},
  reloadSkuItemInfo/* 同款单品新的skuId获取单品信息(侧边用) */: () => {}
});
