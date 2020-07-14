import React, { useContext } from 'react';
import Iconfont from '@src/components/iconfont';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import styles from './index.less';


const Layout = React.memo(({ children }) => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};

  return (
    <div styleName="pay-pop">
      <Iconfont
        className={styles['icon-font']}
        id="close"
        size={16}
        onClick={() => sendMessage(MESSAGES.CANCEL)}
      />
      <div styleName="pay-body">
        {children}
      </div>
    </div>
  );
});

export default Layout;
