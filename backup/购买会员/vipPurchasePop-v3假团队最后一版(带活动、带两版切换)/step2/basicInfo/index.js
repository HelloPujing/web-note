import React, { useContext, useMemo } from 'react';
import VipTagWithTxt from '@src/components/vipTag/vipTagWithTxt';
import { userContext } from '@src/components/context/userProvider';

import './index.less';


const BasicInfo = React.memo(() => {
  const { isVip, memberType, memberTime, userInfo } = useContext(userContext);
  const { nickname = '', id } = userInfo || {};
  const userVipInfo = useMemo(
    () => ({ id, memberType, memberTime }),
    [id, memberTime, memberType]
  );

  return (
    <>
      <div styleName="basic-info">
        {/* 标题 */}
        <section styleName="left">
          <span styleName="username">{nickname}</span>
          {/* vip tag */}
          <VipTagWithTxt
            userInfo={userVipInfo}
            text={({ date }) => (isVip && date <= 30 ? (date <= 0 ? '今日到期' : `${date}天后到期`) : '')}
          />
        </section>
        <section styleName="right" />
      </div>
    </>
  );
});

export default BasicInfo;
