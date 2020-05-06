import React from 'react';
import Button from '@src/components/button';
import { SKU_TYPE } from 'Service/constService';
import './btnGroupBar.less';

const BtnGroupBar = React.memo(props => {
  const {
    itemInfo, type, sendBtnEl, _onSend, _onMore,
    onCollect
  } = props;

  if (type === 1) {
    return null;
  }
  return (
    <ul styleName="group-btn-wrapper">
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
        {itemInfo.id ? (
          <Button.ItemCollectIcon
            data={{ object: itemInfo, type: SKU_TYPE.ITEM }}
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
