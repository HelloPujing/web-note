import React from 'react';
import Button from '@src/components/button';
// import CollectBtn from 'Components/common/btns/collectBtn';
import { SKU_TYPE } from 'Service/constService';
import FloatChatBtn from '../floatChatBtn';
import './btnGroupBar.less';

const BtnGroupBar = React.memo(props => {
  const {
    itemInfo, brandContainerId, type, showDpBtn, sendBtnEl, chatToBuyItem, _onSend, _onMore,
    onCollect
  } = props;

  const combinedItemInfo = { ...itemInfo, brandContainerId }; // 给收藏按钮组装过的itemInfo

  if (type === 1) {
    return null;
  }
  console.log('combinedItemInfo', combinedItemInfo);
  return (
    <ul styleName="group-btn-wrapper">
      {
        showDpBtn ? (
          <li styleName="">
            <FloatChatBtn
              chatToBuyItem={chatToBuyItem}
            />
          </li>
        ) : null
      }
      <li
        styleName="send-info-btn"
        ref={sendBtnEl}
        style={{ position: 'relative' }}
        onClick={_onSend}
      >
        <i />
        <span>发送</span>
      </li>
      <li styleName="collect-btn">
        {combinedItemInfo.id ? (
          <Button.ItemCollectIcon
            data={{ object: combinedItemInfo, type: SKU_TYPE.ITEM }}
            showText
            hookFunction={onCollect}
          />
        ) : null}
      </li>
      <li
        styleName="more-btn"
        onClick={_onMore}
      >
        <i />
        <span>更多</span>
      </li>
    </ul>
  );
});

export default BtnGroupBar;
