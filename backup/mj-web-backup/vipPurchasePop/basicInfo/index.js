import React, { useContext, useMemo, useState } from 'react';
import Modal from '@src/widgets/modal';
import VipTagWithTxt from '@src/components/vipTag/vipTagWithTxt';
import { userContext } from '@src/components/context/userProvider';
import ModalPrivilegeList from './modalPrivilegeList';

import './index.less';


const BasicInfo = React.memo(() => {
  const { isVip, memberType, memberTime, userInfo } = useContext(userContext);
  const { nickname = '', id } = userInfo || {};
  const userVipInfo = useMemo(
    () => ({ id, memberType, memberTime }),
    [id, memberTime, memberType]
  );

  const [modalVisible, setModalVisible]/* 权益弹窗 */ = useState(true);

  // 配置权益
  // const [privileges, setPrivileges]/* 权益列表 */ = useState([]);
  // useEffect(() => {
  //   networkService
  //     .get({ url: `${Api.member.equited}` })
  //     .then(r => {
  //       if (Array.isArray(r)) setPrivileges(r);
  //     });
  // }, []);

  return (
    <>
      <div styleName="vip-guide-info">
        {/* 标题 */}
        <div styleName="title-bar">
          <h1>购买会员</h1>
          <span styleName="username">账号：{nickname}</span>
          {/* vip tag */}
          <VipTagWithTxt
            userInfo={userVipInfo}
            text={({ date }) => (isVip && date <= 30 ? (date <= 0 ? '今日到期' : `${date}天后到期`) : '')}
          />
          <div
            styleName="privilege-btn"
            onClick={() => setModalVisible(true)}
          >
            查看会员特权
          </div>
        </div>
      </div>
      {/* 权益弹窗 */}
      <Modal
        visible={modalVisible}
        type="frame"
        footer={false}
      >
        <ModalPrivilegeList close={() => setModalVisible(false)} />
      </Modal>
    </>
  );
});

export default BasicInfo;
