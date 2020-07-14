import React from 'react';
import './index.less';

const ModalGroupPayInfo = React.memo(() => {
  return (
    <section styleName="modal-body">
      <div styleName="content">
        <h1>关于团队购买</h1>
        <p>
          一次性购买2个以上的美间会员12个月使用权，更可享受团购折扣。2个起售，不限最高购买数量。
        </p>
        <h1>获取兑换码</h1>
        <p>
          在完成支付购买后，您将立即获得相应数量的兑换码，每个兑换码对应12个月的美间会员使用权。您可以在右上角的“个人中心”中打开“我的账户-会员购买记录”来查看兑换码。团队版兑换码，可以复制后发给其他美间用户使用。
        </p>
        <h1>使用兑换码</h1>
        <p>
          <div>登录需要兑换的账户，在右上角的“个人中心”中打开“我的会员”，在“兑换码”输入框中输入兑换码，点击“提交”即可完成兑换。兑换后该账号将获得12个月的美间会员使用权。每个兑换码仅能使用一次。</div>
          <div>兑换码购买后，请在一年内使用，过期将无法使用。</div>
        </p>
      </div>
    </section>
  );
});

export default ModalGroupPayInfo;
