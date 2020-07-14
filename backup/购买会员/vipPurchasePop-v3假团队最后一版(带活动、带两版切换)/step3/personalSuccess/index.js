import React from 'react';
import Button from '@src/widgets/button';
import TitleBar from '../components/titleBar';
import Desc from '../components/desc';
import './index.less';

const PersonalSuccess = React.memo(({ payAmount, expired, postMessageSuccess }) => {
  return (
    <div styleName="">
      <TitleBar title="会员服务开通成功" payAmount={payAmount} />
      <div>
        <Desc k="有效期至：" v={expired} />
      </div>
      <div styleName="footer-btns">
        <Button theme="blue" styleName="btn" onClick={postMessageSuccess}>关闭页面</Button>
      </div>
    </div>
  );
});

export default PersonalSuccess;
