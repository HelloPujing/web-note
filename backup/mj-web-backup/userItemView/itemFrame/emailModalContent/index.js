import React from 'react';
import Button from '@src/widgets/button';
import Input from '@src/widgets/input';
import networkService from '@/service/networkService';
import Api from '@src/api';
import { REG_EMAIL_SERVER } from '@/service/regExp';
import Message from '@meijian/message';

import styles from './index.less';


const INITIAL_STATE = {
  email/* 邮箱 */: ''
};

/**
 * @desc 邮箱弹窗，窗体内容
 * 用途：email picker
 * 页面：单品详情，下载图片时检测邮箱，没有的话弹窗让用户输入邮箱
 *
 */
class EmailModalContent extends React.PureComponent {
  state = INITIAL_STATE;

  /* email输入 */
  onEmailChange = e => {
    const { value } = e.target;
    this.setState({ email: value });
  }

  /* email提交 */
  onSubmitEmail = () => {
    const { onCancel } = this.props;
    const { email } = this.state;
    const valid = REG_EMAIL_SERVER.test(email);
    if (!valid) {
      Message.error('请输入正确的邮箱地址');
      return;
    }
    networkService
      .post({
        url: Api.user.updateEmail,
        data: {
          email
        }
      })
      .then(() => {
        Message.toast('提交成功');
        if (typeof onCancel === 'function') onCancel();
      });
  }

  render() {
    const { onCancel } = this.props;
    const { email } = this.state;
    return (
      <div styleName="email-modal-content">
        <header>
          <div styleName="title">
            <i />
            <span>完善您的个人信息</span>
          </div>
          <div styleName="close-btn" onClick={onCancel} />
        </header>
        <main>
          <section styleName="top-desc">
            <p>
              为了使您可以更高效的获得品牌/产品/设计素材等信息，您需要完善邮件信息后即可完整使用美间所有服务。
            </p>
          </section>
          <section>
            <h1>
              您的邮件信息将可能被用于接收以下信息：
            </h1>
            <ul>
              <li>优质精选方案+案例素材</li>
              <li>最新软装趋势报告</li>
              <li>免费设计师培训课程</li>
              <li>品牌产品清单</li>
              <li>产品图册及最新设计素材</li>
              <li>Contact representative</li>
            </ul>
            <Input
              type="text"
              value={email}
              placeholder="邮箱（用于接收品牌方最新素材和单品）"
              size="md"
              theme="gray"
              className={styles['email-input']}
              onChange={this.onEmailChange}
            />
            <h6>点击“提交”，即表示您的邮箱将被用于接收美间最新设计师服务信息</h6>
          </section>
        </main>
        <footer>
          <Button
            theme="blue"
            className={styles['submit-btn']}
            onClick={this.onSubmitEmail}
          >
            提交
          </Button>
        </footer>
      </div>
    );
  }
}

export default EmailModalContent;
