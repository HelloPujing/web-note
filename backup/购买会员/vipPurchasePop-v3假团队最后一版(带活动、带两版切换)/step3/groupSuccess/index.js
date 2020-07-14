import React, { useCallback } from 'react';
import LinkToService, { ACTION } from '@src/services/route/linkToService';
import Button from '@src/widgets/button';
import TitleBar from '../components/titleBar';
import Desc from '../components/desc';
import './index.less';

const PersonalSuccess = React.memo(({ count, payAmount, postMessageSuccess }) => {
  const toCheckBill = useCallback(() => {
    postMessageSuccess();
    LinkToService.settingBill(undefined, undefined, { type: ACTION.TAB });
  }, [postMessageSuccess]);

  return (
    <div styleName="">
      <TitleBar title="会员购买成功" payAmount={payAmount} />
      <div>
        <Desc k="购买数量：" v={count} />
        <Desc k="有效时长：" v="一年" />
      </div>
      <div styleName="footer-btns">
        <Button styleName="close-btn" onClick={postMessageSuccess}>关闭页面</Button>
        <Button theme="blue" styleName="ok-btn" onClick={toCheckBill}>查看兑换码</Button>
      </div>
    </div>
  );
});

export default PersonalSuccess;
