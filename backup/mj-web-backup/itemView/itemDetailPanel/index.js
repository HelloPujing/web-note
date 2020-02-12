import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  BRAND_ITEM_SALE_TYPE,
  detectBrandItemType
} from 'Service/promotion/dpService';
import { checkLogin, openAuthModal } from '@src/core/userUtils';
import { defineModuleName, collectData } from '@src/core/point';
import CommonPanel from '@src/pages/detailViewer/components/commonPanel';
import { withApp } from '@/hoc/app';
import PubSub from '@/service/pubSub';
// service
import {
  domainURI,
  isShowItemPrice,
  convertLinkToELink
} from '@/service/utilService';
import { getItem } from '@/service/webStorageService';
import Udesk from '@/service/udeskService';
import { USER_ROLE } from '@/service/constService';
// component
import SendMessageBox from '@src/pages/detailViewer/common/sendMessageBox'; // eslint-disable-line
import NameBar from './nameBar';
import PriceBar from './priceBar';
import RedPacketBar from './redPacketBar';
import Description from './description/index';
import BuyBtn from './btns/buyBtn';
import TbkBuyBtn from './btns/tbkBuyBtn';
import TbkShareContainer from './btns/tbkShareContainer';
import EditBtn from './btns/editBtn';
import ContactSupplierBtn from './btns/contactSupplierBtn';
import BtnGroupBar from './btnGroupBar';
// redux
import { getRedPacketInfo } from '@/redux/action/activity/index';
import { settingGlobalModal } from '@/redux/action/common/modal/index';
// style
import styles from './ItemDetailPanel.less';


@defineModuleName('ItemDetailPanel')
@withRouter
@withApp(context => ({ openMenu: context.openMenu }))
@connect(
  state => ({
    isLogin: state.userModel.isLogin,
    userInfo: state.userModel.userInfo,
    redPacketInfo: state.activity.redPacketInfo,
    domains: state.globalApply.auxDomains.arr
  }),
  dispatch => ({
    openModal: payload => {
      dispatch(settingGlobalModal(payload));
    },
    getRedPacketInfo: () => {
      dispatch(getRedPacketInfo());
    }
  })
)
export default class ItemDetailPanel extends PureComponent {
  static propTypes = {
    // from redux
    userInfo: PropTypes.instanceOf(Object),
    redPacketInfo: PropTypes.instanceOf(Object),
    openModal: PropTypes.func,
    openMenu: PropTypes.func,
    getRedPacketInfo: PropTypes.func,
    // props
    itemInfo: PropTypes.instanceOf(Object),
    domains: PropTypes.arrayOf(PropTypes.string)
    // holeCollect: PropTypes.string // ?
  }

  static contextTypes = {
    // funcs
    _analyze: PropTypes.func
  }

  static defaultProps = {
    userInfo: {},
    redPacketInfo: {},
    itemInfo: {},
    // holeCollect: '',
    domains: [],
    openModal: () => {},
    openMenu: () => {},
    getRedPacketInfo: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      showSendPanel: false // 发送面板
    };
    this.sendPanel = null;
    this.sendBtnEl = null;
  }

  componentDidMount() {
    const { getRedPacketInfo } = this.props;

    // 活动红包
    getRedPacketInfo();
  }


  componentWillReceiveProps(nextProps) {
    const { itemInfo, getRedPacketInfo } = this.props;

    if (nextProps.itemInfo.id !== itemInfo.id) {
      getRedPacketInfo();
    }
  }

  // 收藏
  onCollect = event => {
    const { moduleName, itemInfo } = this.props;
    const { id, collected } = itemInfo || {};

    // 收藏埋点
    if (!collected) collectData({ moduleName, key: 'collectItem', info: { itemId: id } });

    // 收藏
    event()
      .then(collected => {
        // 收藏结果
        this.toggleCollectItem({ collected });
      })
      .catch(() => {
        // 收藏异常
      });
  };

  toggleCollectItem = partialItemInfo => {
    // const { holeCollect } = this.props;
    let { itemInfo: { collectCount } } = this.props;
    const { collected } = partialItemInfo;

    let attached;
    collectCount = collectCount || 0;

    switch (collected) {
      case true:
        attached = {
          collectCount: collectCount + 1
        };
        break;
      case false:
        attached = {
          collectCount: collectCount - 1
        };
        break;
      default:
        break;
    }
    // if (holeCollect === 'inputResult') {
    //   PubSub.publish('search-input-result', partialItemInfo);
    // }

    const newPartialItemInfo = { ...partialItemInfo, ...attached };
    PubSub.publish('updateItemInfo', newPartialItemInfo);
    PubSub.publish('item', newPartialItemInfo);
  }

  // _closeBoardShare = (e) => {
  //   if (this.state.showSendPanel && !this.sharePanel.contains(e.target)) {
  //     this.setState({ showSendPanel: false });
  //   }
  // }

  statistics = () => {
    const { _analyze } = this.context;
    _analyze({ category: 'ItemViewer', action: 'ClickOfficialWebSite', label: '' });
  }

  // 是否品牌单品且domain链接
  filterLink = link => {
    const { itemInfo, domains } = this.props;
    const isBrandItem = itemInfo.owner && itemInfo.owner.type === USER_ROLE.BRAND;
    let canGoBuy = false;
    if (domains.length > 0) {
      for (let i = 0; i < domains.length; i++) {
        const domain = link && domainURI(link);
        if (domain && domain.indexOf(domains[i]) > -1) {
          canGoBuy = true;
        }
      }
    }
    return isBrandItem && canGoBuy;
  }

  /**
   * @desc 判断是否淘系链接
   */
  _isTaoBaoLink = itemInfo => {
    if (!itemInfo || !itemInfo.link) return false;

    return ['.taobao.com', '.tmall.com'].some(value => itemInfo.link.indexOf(value) > -1);
  }


  /**
   * @desc 埋点，购买按钮
   */
  _collectDataBuyItem = (itemInfo, key) => {
    const { moduleName } = this.props;
    collectData({ moduleName, key, info: { itemId: itemInfo.id } });
  }

  /**
   * @desc 去淘宝购买埋点
   */
  collectTbkBuyData = () => {
    const { itemInfo } = this.props;
    this._collectDataBuyItem(itemInfo, 'redirectToBuyItem');
  }

  /**
   * @desc 打开认证弹窗
   *
   */
  openAuthGuideDlg = () => {
    const { moduleName, userInfo, itemInfo } = this.props;
    openAuthModal({
      userInfo,
      moduleFrom: moduleName
    });
    collectData({ moduleName, key: 'openAuthIntroducePanel', info: { itemId: itemInfo.id } });
  }

  /**
   * @desc 打开红包弹窗
   * @example
   *
   */

  openRedPacketDlg = () => {
    const { redPacketInfo, openModal } = this.props;
    openModal({
      isOpen: true,
      type: 'redPacketDetail',
      builtInProps: {
        redPacketInfo: redPacketInfo || {}
      }
    });
  }

  /**
   * @desc 咨询按钮，联系二哥；
   * 备注：已废弃，只有直采会出现该按钮
   *
   */
  chatToBuyItem = () => {
    // const { userInfo, itemInfo } = this.props;
    // const { id: itemId } = itemInfo || {};
    // const letterBridge = getLetterBridge(userInfo);
    // this.letterBridge = letterBridge;

    Udesk.showPanel();
  }

  /**
   * @desc 站内发送item给用户
   */
  _onSend = () => {
    const { moduleName, itemInfo } = this.props;
    collectData({ moduleName, key: 'ShareItem', info: { itemId: itemInfo.id } });

    if (!checkLogin()) return;

    this.setState({ showSendPanel: true });
  }

  /**
   * @desc 关闭发送盒子
   */
  closeSendBox = () => this.setState({ showSendPanel: false })

  /**
   * @desc 更多
   */
  _onMore = e => {
    const { itemInfo, openModal, openMenu } = this.props;
    const opts = [{
      label: '举报',
      img: require('Images/1.x/btn_icon_warning_h.png'),
      onClick: () => {
        if (!checkLogin()) return;
        openModal({
          isOpen: true,
          type: 'report',
          builtInProps: { source: 'Item', id: itemInfo.id }
        });
      }
    }];
    openMenu({
      triggerEl: e.currentTarget,
      options: opts,
      config: { gap: 5 }
    });
  }

  render() {
    // itemInfo.shopHasLine：品牌页下有线下店 ? true : false
    const {
      moduleName,
      itemInfo,
      userInfo,
      redPacketInfo,
      openModal
    } = this.props;
    const { showSendPanel } = this.state;
    const {
      old, name, link, shopHasLine, owner
      // itemPrice
    } = itemInfo;
    const { id: itemOwnerId } = owner || {};

    const isCommissionUser = userInfo.isCommissionUser || false;
    const isMyItem = itemOwnerId === getItem('id');
    const isBrandItem = itemInfo.owner && itemInfo.owner.type === USER_ROLE.BRAND;
    const canBuy = this.filterLink(link);
    const isTaoBaoLink = this._isTaoBaoLink(itemInfo);
    // 销售类型：
    const brandItemType = detectBrandItemType(itemInfo);
    // 品牌页id：
    const brandContainerId = isBrandItem ? itemInfo.owner && itemInfo.owner.id : ''; // 品牌页ID
    // 品牌页禁价：
    const brandItemShowPrice = isBrandItem && isShowItemPrice(brandContainerId); // 品牌页单品且显示价格

    // 几种销售按钮的显示逻辑
    let showBuyBtn = false; // 普通购买
    const showDpBtn = false; // 直采
    let showTbkBtn = false; // 淘宝客
    let showTbkShareBtn = false; // 分享

    // 【直采】【淘宝客购买、分享】按钮
    if (isBrandItem && !old) {
      switch (brandItemType) {
        case BRAND_ITEM_SALE_TYPE.DP_TBK:
        case BRAND_ITEM_SALE_TYPE.TBK: // 淘宝客，购买按钮+分享按钮
          showTbkBtn = true;
          showTbkShareBtn = true;
          break;
        // case BRAND_ITEM_SALE_TYPE.DP: // 直采，仅直采按钮
        //   showDpBtn = true;
        //   break;
        case BRAND_ITEM_SALE_TYPE.COMMON:
          // 价格为0也得显示去购买按钮
          if (canBuy) {
            showBuyBtn = true;
          }
          break;
        default:
          break;
      }
    }
    const isTbkShort/* 淘宝客购买/分享按钮短样式 */ = showTbkBtn && showTbkShareBtn;

    return (
      <CommonPanel className={styles['item-detail']}>
        <NameBar
          name={name || ''}
          brandItemType={brandItemType}
        />
        <PriceBar
          itemInfo={itemInfo}
          brandItemShowPrice={brandItemShowPrice}
          isCommissionUser={isCommissionUser}
          isBrandItem={isBrandItem}
          openAuthGuideDlg={this.openAuthGuideDlg}
          chatToBuyItem={this.chatToBuyItem}
        />
        <RedPacketBar
          className={styles['red-packet-bar']}
          label={(<span styleName="red-packet-label">活动</span>)}
          old={old}
          isCommissionUser={isCommissionUser}
          redPacketInfo={redPacketInfo}
          brandItemSaleType={brandItemType}
          openRedPacketDlg={this.openRedPacketDlg}
        />
        <Description
          itemInfo={itemInfo}
          canBuy={canBuy}
          isBrandItem={isBrandItem}
          statistics={this.statistics}
        />
        <div styleName="btns-wrapper">
          {/* 普通购买按钮 */}
          {
            showBuyBtn ? (
              <BuyBtn
                moduleName={moduleName}
                itemInfo={itemInfo}
                _collectDataBuyItem={this._collectDataBuyItem}
              />
            ) : null
          }
          {/* tbk购买按钮 */}
          {
            showTbkBtn ? (
              <TbkBuyBtn
                type="item"
                moduleName={moduleName}
                short={isTbkShort}
                itemInfo={itemInfo}
                itemId={itemInfo.id}
                tbkLink={itemInfo.link}
                eLink={convertLinkToELink(itemInfo, { m: moduleName })}
                collectBuyData={this.collectTbkBuyData}
              />
            ) : null
          }
          {/* tbk分享按钮 */}
          {
            showTbkShareBtn ? (
              <TbkShareContainer
                short={isTbkShort}
                itemInfo={itemInfo}
                // openNoCommissionDlg={this.openNoCommissionDlg}
              />
            ) : null
          }
          {/* 联系供应商按钮 */}
          {
            (isBrandItem && shopHasLine && !isTaoBaoLink && !showDpBtn) ? (
              <ContactSupplierBtn
                itemInfo={itemInfo}
                openModal={openModal}
              />
            ) : null
          }
          {/* 我的单品 - 编辑按钮 */}
          {
            isMyItem ? (
              <EditBtn
                moduleName={moduleName}
                itemInfo={itemInfo}
                openModal={openModal}
              />
            ) : null
          }
        </div>
        <BtnGroupBar
          itemInfo={itemInfo}
          brandContainerId={isBrandItem ? brandContainerId : ''} // 请求供应商列表用
          sendBtnEl={el => { this.sendBtnEl = el; }}
          showDpBtn={showDpBtn}
          _onSend={this._onSend}
          _onMore={this._onMore}
          chatToBuyItem={this.chatToBuyItem}
          onCollect={this.onCollect}
        />
        <div ref={el => { this.sendPanel = el; }}>
          <SendMessageBox
            type="item"
            brandContainerId={isBrandItem ? brandContainerId : ''} // 请求供应商列表用
            info={itemInfo} // 私信用
            show={showSendPanel}
            closeShareBox={this.closeSendBox}
          />
        </div>
      </CommonPanel>
    );
  }
}
