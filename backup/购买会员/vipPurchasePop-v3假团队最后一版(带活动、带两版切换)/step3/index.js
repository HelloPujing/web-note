import React, { useCallback, useContext } from 'react';
import { parseTime } from '@meijian/date';
import { messageContext } from '@src/pages/proVersionPay/frame/messageProvider';
import PersonalSuccess from './personalSuccess';
import GroupSuccess from './groupSuccess';
import './index.less';

const Step3 = React.memo(({ isGroup, successInfo }) => {
  const { MESSAGES, sendMessage } = useContext(messageContext) || {};
  const { count, payAmount, useBalance, memberTime } = successInfo || {};

  // 365天凌晨到期，所以-1天显示
  const expired = parseTime(memberTime - 24 * 60 * 60 * 1000, 'yyyy-MM-dd');

  const postMessageSuccess = useCallback(() => {
    sendMessage(MESSAGES.SUCCESS, { isGroup, useBalance });
  }, [MESSAGES.SUCCESS, isGroup, sendMessage, useBalance]);

  return (
    <div styleName="step3">
      {
        isGroup ? (
          <GroupSuccess
            count={count}
            payAmount={payAmount}
            postMessageSuccess={postMessageSuccess}
          />
        ) : (
          <PersonalSuccess
            payAmount={payAmount}
            expired={expired}
            postMessageSuccess={postMessageSuccess}
          />
        )
      }
    </div>
  );
});

export default Step3;
