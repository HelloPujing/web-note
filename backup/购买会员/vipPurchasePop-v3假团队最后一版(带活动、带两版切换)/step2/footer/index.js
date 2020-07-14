import React, { useCallback, useContext } from 'react';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import './index.less';

const Footer = React.memo(({ children }) => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};
  const openUDesk = useCallback(() => {
    sendMessage(MESSAGES.U_DESK);
  }, [MESSAGES.U_DESK, sendMessage]);

  return (
    <div styleName="footer-hints">
      <p>{children}</p>
      <p>
        如需发票，或支付遇到问题，请点击
        <em onClick={openUDesk}>“联系美间客服”</em>
      </p>
    </div>
  );
});

export default Footer;
