import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineUseModuleName, collectData } from '@src/core/point';
import { checkLogin } from '@src/core/userUtils';
import PriceUtils from '@src/core/price/index';
import classnames from 'classnames';
import withTbkAuth from '@/hoc/withTbkAuth';
// import ShareBtn from '@/components/common/btns/shareBtn';
import networkService from '@/service/networkService';
import { convertLinkToELink, getBubblePath } from '@/service/utilService';
import TbkLinkSharePanel from '@/components/common/mall/tbkLinkSharePanel';
import Message from '@/components/widgets/message';
import styles from './tbkShareContainer.less';
import Api from '@/api';
import { TBK_AUTH_BIND_TYPE } from '@/service/mall/constService';

const propTypes = {
  // form hoc
  tbkAuth: PropTypes.func,

  // props
  aside: PropTypes.bool,
  moduleName: PropTypes.string.isRequired,
  short: PropTypes.bool,
  itemInfo: PropTypes.instanceOf(Object).isRequired
};

const defaultProps = {
  aside: false,
  short: false,
  tbkAuth: () => {}
};

@defineUseModuleName
@withTbkAuth
class TbkShareContainer extends PureComponent {
  state = {
    taoKouLing: '', // 废弃，每次都请求
    showSharePanel: false
  }

  componentDidMount() {
    // document.getElementById('app').addEventListener('click', this._closeBoardShare, false);
    if (typeof this.hideSharePanel === 'function') {
      document.body.addEventListener('mousedown', this.hideSharePanel, false);
    }
  }

  componentWillUnmount() {
    // document.getElementById('app').removeEventListener('click', this._closeBoardShare);
    if (typeof this.hideSharePanel === 'function') {
      document.body.removeEventListener('mousedown', this.hideSharePanel, false);
    }
  }

  // 分享

  hideSharePanel = e => {
    const path = e.path || getBubblePath(e.target); const { shareLayEl } = this;
    const { shareBtnEl } = this;
    const { showSharePanel } = this.state;
    if (path.indexOf(shareLayEl && shareLayEl.shareContent) !== -1 || path.indexOf(shareBtnEl) !== -1) return;

    if (showSharePanel) {
      this.setState({
        showSharePanel: false
      });
    }
  }


  /**
   * @desc 淘宝客 分享按钮
   */
  handleShareBtnClick = () => {
    if (!checkLogin()) return;

    const {
      moduleName, itemInfo, tbkAuth
    } = this.props;

    collectData({ moduleName, key: 'getTaoKouLing', info: { itemId: itemInfo.id } });

    tbkAuth({ bindType: TBK_AUTH_BIND_TYPE.ITEM_SHARE })
      .then(() => { // c
        this.requestTkl();
      });
  }

  requestTkl = () => {
    const { itemInfo } = this.props;
    networkService.post({
      url: Api.tbk.tklGet,
      data: {
        itemId: itemInfo.id
      },
      success: res => {
        this.setState({
          taoKouLing: res,
          showSharePanel: true
        });
      },
      catchError: true,
      error: m => {
        Message.toast(m); // 只有-86了 代表转链失败无法分享淘口令
        // switch (c) { // 分享
        // case -88: // 未授权 已讨论让服务端删除
        //   tbkAuth({
        //     bindType: TBK_AUTH_BIND_TYPE.ITEM_SHARE
        //   })
        //     .then(() => {
        //       this.requestTkl();
        //     });
        // break;
        // case -87: 不存在
        //   // 用户pid转链失败，有官方淘口令 - 弹框提示'此商品刚刚上架，暂无佣金哦，是否继续？' - 继续则用官方淘口令
        //   // r=官方淘口令
        //   this.openNoCommissionDlg(() => {
        //     this.setState({
        //       taoKouLing: r,
        //       showSharePanel: true
        //     });
        //   });
        //   break;
        // case -86: // 官方转链失败，彻底无淘口令 - 错误提示'此商品无法分享淘口令'
        //   Message.toast('此商品无法分享淘口令');
        //   break;
        // default:
        // 2001 用户未认证
        // -1001 参数错误
        // 2004 单品不存在
        // -99 操作失败，请重试
        // -999 系统异常
        // Message.toast(m);
        // break;
        // }
      }
    });
  }

  render() {
    const { aside, moduleName, short, itemInfo } = this.props;
    const { taoKouLing, showSharePanel } = this.state;
    const {
      id, name, commissionRate, itemPrice
    } = itemInfo || {};
    return (
      <div
        styleName={classnames('share-btn', { short })}
        ref={el => { this.shareBtnEl = el; }}
        onClick={this.handleShareBtnClick}
      >
        <span styleName="share-text">去推荐</span>
        <span styleName="rebate-text"> 赚¥{PriceUtils.$detailRule.calcRebatePrice(commissionRate, itemPrice)}</span>
        {
          showSharePanel
            ? (
              <TbkLinkSharePanel
                className={aside ? null : styles.tbkLinkSharePanel}
                type="item"
                shareId={id}
                shareName={name}
                moduleName={moduleName}
                shareLink={convertLinkToELink(itemInfo, { m: moduleName })}
                taoKouLing={taoKouLing}
                ref={el => { this.shareLayEl = el; }}
              />
            ) : null
        }
      </div>
    );
  }
}

TbkShareContainer.propTypes = propTypes;
TbkShareContainer.defaultProps = defaultProps;

export default TbkShareContainer;
