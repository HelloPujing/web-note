import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import './proVersionPay.less'
import Message from 'Components/widgets/message';
import {settingPayPop} from '@/redux/action/common/payPop/index'
import {settingGlobalModal} from '@/redux/action/common/modal/index'
import * as clientService from 'Service/clientShellService'
import networkService from 'Service/networkService'
import {generateObjectId} from 'Service/utilService'
import { collectData, defineModuleName } from "../../../src/core/point";

@defineModuleName('ProPay')
@connect((state) => {
  return {
    isOpen: state.common.payPop.isOpen,
    event: state.common.payPop.event
  }
}, (dispatch) => {
  return {
    closePayPop: () => {
      dispatch(settingPayPop({isOpen: false}))
    },
    openModal: (payload)=>{
      dispatch(settingGlobalModal(payload));
    }
  }
})
export default class ProVersionPay extends PureComponent {
  static contextTypes = {
    _analyze: PropTypes.func,
    _toggleStopPay: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      payWay: -1,      // 0: 1个月 1: 3个月 2 12个月
      payAmount: 0,
      payAmountByYear: 0,
      payAmountByGroup: 0,
      info: {},
      fetched: false,
      countEditing: false, //是否处于编辑状态
      groupCount: 5,       //默认团购团购数量
      remainBuyCount: -1
    }
  }
  choosePayWay = (payWay) => {
    const { moduleName } = this.props;
    if (payWay === this.state.payWay) {
      return
    }
    this.setState({payWay, payAmount: this.state.info[payWay].payAmount}, function () {
      let eventId = generateObjectId();
      this.context._analyze({
        category: 'Pay',
        action: 'ChoosePayType',
        label: 'Product',
        value: payWay
      });

      collectData({ moduleName, key: 'choosePay', info: { productId: this.state.info[payWay].id } });

      // 保持用户点击的链路
      this.eventReferIdForPayWay = eventId;
    })
  }
  payWayHandle = (payApp) => {
    const { moduleName } = this.props;
    if (this.state.payWay === -1) {
      Message.error('请选择购买的产品');
      return
    }
    if (this.state.remainBuyCount > 0 && this.state.remainBuyCount < 5) {
      Message.error(`超过限定购买次数！还剩${this.state.remainBuyCount}次`);
    }
    new Promise((resolve) => {
      if (this.inputEl === document.activeElement) {
        this.inputEl.blur();
        setTimeout(() => {
          resolve()
        }, 0)
      } else {
        resolve();
      }
    }).then(() => {
      // 生成订单号完毕后传递
      let productId = this.state.info[this.state.payWay].id,
        paymentAmount = this.state.info[this.state.payWay].payAmount,
        count = this.state.payWay === 3 ? this.state.groupCount : 1,
        postData = {productId, count};
      if (payApp === 'ali') {
        postData.width = 208;
      }
      networkService.post({
        url: payApp === 'wechat' ? '/pay/getWeixinPayContent' : '/pay/getAlipayContent',
        data: postData,
        success: (orderInfo) => {
          if (!this.updater.isMounted(this)) return
          if (this.state.payWay && orderInfo.remainBuyCount !== -1 && count > orderInfo.remainBuyCount) {
            Message.error(`超过限定购买次数！还剩${orderInfo.remainBuyCount}次`);
            this.setState({
              remainBuyCount: orderInfo.remainBuyCount
              // groupCount: orderInfo.remainBuyCount > 5 ? orderInfo.remainBuyCount : 5
            });
            return;
          }
          this.props.openModal({
            isOpen: true,
            type: 'scanPayQRCode',
            builtInProps: {
              productId,
              paymentAmount: this.state.payWay === 3 ? Math.round(paymentAmount * count * 100) / 100 : paymentAmount,
              payApp,
              orderInfo,
              count,
              isGroupPay: this.state.payWay === 3
            }
          });
          this.eventId = generateObjectId();
          this.context._analyze({
            category: 'Pay',
            action: 'ChoosePayType',
            label: 'Channel',
            value: payApp
          });

          collectData({ moduleName, key: 'choosePayChannel', info: { channel: payApp } });
        }
      })
    })
  }
  closePayPop = () => {
    this.setState({fetched: false, groupCount: 5});
    this.props.closePayPop();
    this.context._toggleStopPay(true)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      if (nextProps.isOpen) {
        networkService.post({
          url: '/pay/getChargeProducts',
          catchError: true,
          success: (info) => {
            if (!this.updater.isMounted(this)) return
            this.setState({
              info,
              fetched: true,
              payWay: 2,
              payAmount: info[2].payAmount,
              payAmountByYear: info[2].payAmount,
              payAmountByGroup: info[3].payAmount
            });
          },
          error: () => {
            Message.error('获取价格失败！请联系美间客服');
          }
        })
      } else {
        this.setState({fetched: false, groupCount: 5});
      }
    }
  }

    showIntroduce = ()=>{
    this.props.openModal({
      isOpen: true,
      type: 'introduceGroupPay',
      builtInProps: {}
    })
  }

  render() {
    const {isOpen} = this.props;
    const { payWay, payAmount, fetched, info, groupCount, payAmountByGroup, payAmountByYear} = this.state;
    let payTotal = '',
      price = parseFloat(payAmount),
      count = groupCount === '' ? 0 : groupCount;
    if (payWay !== -1) {
      if (payWay === 3) {
        payTotal = `¥${ Math.round(price * count * 100) / 100}`;
      } else {
        payTotal = `¥${price}`;
      }
    }
    return isOpen ? (
      <section styleName="pay-pop">
        <i styleName="close-btn" onClick={this.closePayPop} />
        <div styleName="pay-body">
          <div styleName="top-bg" />
          <div styleName="content">
            <p styleName="p-1">购买 / 续费专业版</p>
            <p styleName="p-2">(续费将积累时长, 付款后立刻生效)</p>
            {
              fetched ? (
                <div styleName="pay-way">
                  <div styleName={`m ${payWay === 0 ? 'active' : ''}`} onClick={() => {
                    this.choosePayWay(0)
                  }}>
                    <p>
                      <span>{parseInt(info[0].days / 30)}</span>
                      <span styleName="bold">个月</span>
                    </p>
                    <h3>{info[0].payAmount}元</h3>
                  </div>
                  <div styleName={`m middle ${payWay === 1 ? 'active' : ''}`} onClick={() => {
                    this.choosePayWay(1)
                  }}>
                    <div styleName="tag-discount">{(info[1].discount / 10)}折</div>
                    <div styleName="red-bg"/>
                    <p>
                      <span>{parseInt(info[1].days / 30)}</span>
                      <span styleName="bold">个月</span>
                    </p>
                    <h3>{info[1].payAmount}元</h3>
                  </div>
                  <div styleName={`m middle ${payWay === 2 ? 'active' : ''}`} data-payway='2' onClick={() => {
                    this.choosePayWay(2)
                  }}>
                    <div styleName="tag-discount">特惠</div>

                    <div styleName="red-bg"/>
                    <p>
                      <span>{parseInt(info[2].days / 30)}</span>
                      <span styleName="bold">个月</span>
                    </p>
                    <h3 styleName="t-year-wrap">
                      <span styleName="t-year-price">{payAmountByYear}</span>元
                      <span styleName="t-origin-price">
                        <i>{info[0].payAmount * 12}</i>元
                      </span>
                    </h3>
                  </div>
                  <div styleName={`m middle ${payWay === 3 ? 'active' : ''}`} onClick={() => {
                    this.choosePayWay(3)
                  }}>
                    <div styleName="recommend">
                      <span>团队购买</span>
                      <i styleName={`help${payWay === 3 ? ' active' : ''}`}
                         onClick={this.showIntroduce}/>
                    </div>
                    <div styleName="tag-discount">特惠</div>

                    <div styleName="red-bg"/>
                    <p style={{marginTop: 44}}>
                      <span>{parseInt(info[3].days / 30)}</span>
                      <span styleName="bold">个月</span>
                    </p>
                    <div styleName="group-count">
                      <i styleName={`reduce${payWay === 3 ? ' active' : ''}${groupCount === 5 ? ' unable' : ''}`}
                         onClick={() => {
                           if (groupCount === 5) {
                             return
                           } else if (groupCount < 5) {
                             this.setState({groupCount: 5})
                           } else {
                             this.setState({groupCount: groupCount - 1});
                           }
                         }}/>
                      {
                        this.state.countEditing ? (
                          <input
                            ref={el => this.inputEl = el}
                            type="text"
                            value={this.state.groupCount}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                            }}
                            onChange={(e) => {
                              let {value} = e.target;
                              if ((/^[0-9]*$/.test(value) && value.length < 3) || !value) {
                                this.setState({groupCount: Number(value)});
                              }
                            }}
                            onBlur={(e) => {
                              let {value} = e.target;
                              if (value === '') {
                                this.setState({groupCount: 5, countEditing: false});
                              } else if (parseInt(value) > 30 || parseInt(value) < 5) {
                                this.setState({groupCount: 5, countEditing: false});
                                Message.error('每人最多可购买5～30份');
                              } else {
                                this.setState({countEditing: false});
                              }
                            }}
                          />
                        ) : (
                          <span
                            styleName="count"
                            onClick={() => {
                              this.setState({countEditing: true}, () => {
                                setTimeout(() => {
                                  this.inputEl.focus();
                                }, 0)
                              })
                            }}
                          >{this.state.groupCount}</span>
                        )
                      }
                      <span styleName="text">人</span>
                      <i styleName={`add${payWay === 3 ? ' active' : ''}${groupCount === 30 ? ' unable' : ''}`}
                         onClick={() => {
                           if (groupCount === 30) {
                             return
                           } else if (groupCount > 30) {
                             this.setState({groupCount: 30})
                           } else {
                             this.setState({groupCount: Number(groupCount) + 1})
                           }
                         }}
                      />
                    </div>
                    <h3 styleName="group" style={{marginTop: 16}}>{payAmountByGroup}元/人</h3>

                  </div>
                </div>
              ) : null
            }
            <div styleName="total-money">
              <span>合计：</span>
              {
                payWay === 3 ? (
                  <span>
                    <em>{` ¥${payAmount} * `}</em>
                    <span style={{fontSize: 24}}>{count}</span>
                    <em>{` = ${payTotal}`}</em>
                  </span>
                ) : (
                  <em>{payTotal}</em>
                )
              }
            </div>
            <div styleName="pay-btns">
              <div styleName="wechat-pay-btn" onClick={() => {
                this.payWayHandle('wechat')
              }}>
                <i/>
                <p>微信支付</p>
              </div>
              <div styleName="ali-pay-btn" onClick={() => {
                this.payWayHandle('ali')
              }}>
                <i/>
                <p>支付宝支付</p>
              </div>
            </div>
            <p styleName="helpfull-hints">可申请发票, 如需发票，请在购买后于“我的账户-账单查询”页面下点击“联系美间客服”</p>
          </div>
        </div>
      </section>
    ) : null
  }
}
