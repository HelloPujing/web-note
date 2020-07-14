import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { USER_ROLE } from '@src/const';
import './scanPayQRCode.less';
import QRCode from 'qrcode.react';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import networkService from 'Service/networkService';
import { MEMBER_LEVEL } from 'Service/constService';
import Message from 'Components/widgets/message';
import Modal from '@/components/widgets/modal';
import { getUserInfo } from '@/redux/action/userModel';
import { settingPayPop } from '@/redux/action/common/payPop/index';
import { settingGlobalModal } from '@/redux/action/common/modal/index';

// 先人的老版本扫码弹窗，已废弃

const LOADING_KEEP_TIME = 1000;
const ORDER_POLL_TIME = 2000;
const REFRESH_TIME = 60000 * 60;

@connect(
  state => {
    return {
      userInfo: state.userModel.userInfo
    };
  },
  dispatch => {
    return {
      getUserInfo: () => {
        dispatch(getUserInfo());
      },
      closePayPop: () => {
        dispatch(settingPayPop({ isOpen: false }));
      },
      openModal: payload => {
        dispatch(settingGlobalModal(payload));
      }
    };
  }
)
export default class ScanPayQRCode extends PureComponent {
  static propTypes = {
    payApp: PropTypes.string.isRequired,
    paymentAmount: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    userInfo: PropTypes.instanceOf(Object).isRequired,
    getUserInfo: PropTypes.func.isRequired,
    orderInfo: PropTypes.instanceOf(Object).isRequired,
    count: PropTypes.number.isRequired,
    isGroupPay: PropTypes.bool.isRequired // 是否给组团
  };

  constructor(props) {
    super(props);
    const { orderInfo, userInfo } = props;
    this.state = {
      refresh: false,
      loading: false,
      orderIsComplete: false, // 订单是否完成
      bonusAlreadyGiven: false, // 是否送过专业版
      orderInfo,
      lastMemberLevel: userInfo.memberLevel
    };
    // 定时器具柄
    this.t = 0;
  }

  componentDidMount() {
    const { payApp } = this.props;
    const { orderInfo } = this.state;
    // this.createQRCode();
    this.createOrderPoll();
    this.setRefreshQRCode();
    if (payApp === 'ali') {
      setTimeout(() => {
        const { contentDocument } = this.iframeEl;
        contentDocument.open();
        contentDocument.write(
          `<script>setTimeout(function(){document.body.style.overflow = 'hidden'}, 2000)</script>${
            orderInfo.content
          }`
        );
        contentDocument.close();
      }, 0);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { userInfo } = this.props;
    const { bonusAlreadyGiven, orderIsComplete, orderInfo } = this.state;
    const isCommonUser = userInfo.type === USER_ROLE.COMMENT;

    if (prevState.orderIsComplete !== orderIsComplete) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ loading: true });
      if (prevState.orderIsComplete) {
        if (this.iframeEl) {
          const { contentDocument } = this.iframeEl;
          contentDocument.open();
          contentDocument.write(
            `<script>setTimeout(function(){document.body.style.overflow = 'hidden'}, 2000)</script>${
              orderInfo.content
            }`
          );
          contentDocument.close();
        }
      }
      setTimeout(() => {
        // 设置用户状态
        const { isGroupPay, openModal, closeModal, closePayPop } = this.props;
        const { lastMemberLevel, orderInfo } = this.state;
        if (isGroupPay) {
          setTimeout(() => {
            openModal({
              isOpen: true,
              type: 'copyPayCode',
              builtInProps: {
                orderId: orderInfo.orderId.toString(),
                fromPaySuccess: true
              }
            });
          }, 600);
        } else if (isCommonUser && !bonusAlreadyGiven) {
          setTimeout(() => {
            Message.success('购买成功！开始享受美间会员特权吧！');
          }, 600);
        } else {
          // TODO 逗叔说不需要判断逻辑
          // Message.success(lastMemberLevel === MEMBER_LEVEL.LEVEL_PAYED ? '续费成功，继续使用专业版吧!' : '购买成功! 开始体验专业版!');
          Message.success('购买成功！开始享受美间会员特权吧！');
        }
        closeModal();
        closePayPop();
      }, LOADING_KEEP_TIME);
    }
  }

  componentWillUnmount() {
    clearInterval(this.t);
  }

  // 创建轮询
  createOrderPoll = () => {
    const { getUserInfo } = this.props;
    const { refresh, orderInfo } = this.state;
    this.t = setInterval(() => {
      if (refresh) {
        return;
      }
      networkService.post({
        url: '/trade/checkOrderStatusNew',
        data: {
          id: orderInfo.orderId
        },
        success: r => {
          if (!this.updater.isMounted(this)) return;
          const { orderStatus, alreadyGive } = r;

          if (orderStatus === 1) {
            // 0: 订单创建 待支付(也是未完成) 1:订单完成 2:订单关闭
            this.setState({
              orderIsComplete: true,
              bonusAlreadyGiven: !!alreadyGive
            });
            getUserInfo();

            clearInterval(this.t);
          }
        },
        error: () => {
          return true;
        }
      });
    }, ORDER_POLL_TIME);
  };

  createQRCode = () => {
    const { payApp, productId, count } = this.props;
    const postData = { productId, count };
    if (payApp === 'ali') {
      postData.width = 208;
    }
    networkService.post({
      url:
        payApp === 'wechat'
          ? '/pay/getWeixinPayContent'
          : '/pay/getAlipayContent',
      data: postData,
      success: r => {
        if (!this.updater.isMounted(this)) return;
        this.setState({ orderInfo: r }, () => {
          if (payApp === 'ali') {
            setTimeout(() => {
              const { contentDocument } = this.iframeEl;
              contentDocument.open();
              contentDocument.write(
                `<script>setTimeout(function(){document.body.style.overflow = 'hidden'}, 2000)</script>${
                  r.content
                }`
              );
              contentDocument.close();
            }, 0);
          }
        });
      },
      error: () => {
        Message.error('获取二维码失败！请联系美间客服');
        return true;
      }
    });
  };

  setRefreshQRCode = () => {
    setTimeout(() => {
      this.setState({ refresh: true });
    }, REFRESH_TIME);
  };

  refreshRQCode = () => {
    this.setState({ refresh: false });
    this.createQRCode();
    this.setRefreshQRCode();
  };

  render() {
    const { payApp, closeModal, paymentAmount } = this.props;
    const { loading, refresh, orderInfo } = this.state;
    return (
      <Modal closeModal={closeModal}>
        {loading ? (
          <div styleName="scan-for-pay h-center">
            <i styleName="loading" />
            <p styleName="loading-msg">正在读取中付款信息...</p>
          </div>
        ) : (
          <div styleName="scan-for-pay">
            <i styleName="close-btn" onClick={closeModal} />
            <p styleName="title">
              {payApp === 'wechat' ? '微信' : '支付宝'}扫码付款 ¥{paymentAmount}
            </p>
            <div styleName="qr-wrapper">
              {isEmpty(orderInfo) ? null : payApp === 'wechat' ? (
                <QRCode value={orderInfo.content} size={208} />
              ) : (
                <iframe
                  title="content"
                  ref={el => {
                    this.iframeEl = el;
                  }}
                />
              )}
              {refresh ? (
                <div styleName="refresh-qrCode" onClick={this.refreshRQCode}>
                  <i />
                  <p>刷新二维码</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
