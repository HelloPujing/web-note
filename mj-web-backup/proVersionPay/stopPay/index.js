import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import Message from 'Components/widgets/message';
import networkService from 'Service/networkService'
import Api from '@/api';
import './stopPay.less'
import * as  clientService from 'Service/clientShellService'

const REASON = ['价格过高', '我还在试用专业版', '对我来说专业版功能还不够', '其他'];

class StopPay extends PureComponent {
  static contextTypes = {
    _toggleStopPay: PropTypes.func
  }
  state = {
    showTextarea: false,
    options: {
      id: -1,
      other: '',
      otherLength: 0
    }
  }
  _changeOption = (index) => {
    this.setState({
      showTextarea: REASON.length === index + 1,
      options: {...this.state.options, id: index}
    }, () => {
      index !== REASON.length - 1 && this._submitSuggestion();
    });
  }
  _inputSuggestion = (e) => {
    let value = e.target.value || '';
    this.setState({
      options: {...this.state.options, other: value, otherLength: value.length}
    });
  }
  _submitSuggestion = () => {
    let {id, other: msg} = this.state.options,
      url = Api.pay.rejectBuy,
      data = {
        reasonType: id,
        reason: id === REASON.length - 1 ? msg : ''
      };
    if (id < 0) {
      Message.error('请留下您宝贵的意见吧！');
      return false;
    }
    if (id === REASON.length - 1 && !msg) {
      Message.error('请留下您宝贵的意见吧！');
      return false;
    }
    if (msg && msg.length >= 400) {
      Message.error('最长不可超过400字');
      return false;
    }
    networkService.post({
      url,
      data,
      success: () => {
        Message.success('提交成功，谢谢反馈');
        // 关闭当前窗体
        this.context._toggleStopPay();
      }
    });
  }

  render() {
    return (
      <div styleName="stop-pay" >
        <div styleName="cover" />
        <div styleName='content'>
          <span styleName='close' onClick={() => {
            this.context._toggleStopPay();
          }} />
          <p styleName='help-us'>帮助我们做的更好，谢谢！</p>
          <p styleName='tell-me-why'>请问是什么原因</p>
          <p styleName='tell-me-why'>导致您放弃升级方案？</p>
          <ul>
            {
              REASON.map((item, index) => {
                let selected = this.state.options.id === index && index !== REASON.length - 1 ? `show-button` : '';
                return (
                  <li key={index}
                    onClick={() => {
                      this._changeOption(index);
                    }}>
                    <i />{item}
                    <span styleName={`select-button ${selected}`}>选择</span>
                  </li>
                );
              })
            }
          </ul>
          {
            this.state.showTextarea ? (
              <div styleName='other-detail'>
                <textarea
                  styleName='other'
                  placeholder='留下您宝贵的意见吧'
                  onChange={(e) => {
                    this._inputSuggestion(e);
                  }}
                />
                {
                  this.state.options.otherLength >= 380 ? (
                    <span
                      styleName={this.state.options.otherLength <= 400 ? `words` : `warning`}>{this.state.options.otherLength}个字</span>
                  ) : null
                }

              </div>
            ) : null
          }
          {
            this.state.showTextarea ? (
              <input type='button' styleName='submit-button' value='提交' onClick={this._submitSuggestion} />
            ) : null
          }
        </div>

      </div>
    );
  }
}

export default StopPay
