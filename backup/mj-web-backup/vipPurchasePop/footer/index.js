import React, { useCallback, useContext } from 'react';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import './index.less';

const Footer = React.memo(() => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};
  const openUDesk = useCallback(() => {
    sendMessage(MESSAGES.U_DESK);
  }, [MESSAGES.U_DESK, sendMessage]);

  return (
    <div styleName="footer-hints">
      <p>
        可按实际支付金额申请发票（美间余额抵扣部分无发票），如需发票
        <em onClick={openUDesk}>“联系美间客服”</em>
      </p>
    </div>
  );
});

export default Footer;
