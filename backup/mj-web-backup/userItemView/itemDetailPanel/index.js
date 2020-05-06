import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { checkLogin } from '@src/core/userUtils';
import { defineModuleName, collectData } from '@src/core/point';
import SendMessageBox from '@src/components/card/sendMessageBox';
import CommonPanel from '@src/pages/detailViewer/components/commonPanel';
import ItemDetailEditorModal from '@src/components/item/editor';
import { settingGlobalModal } from '@src/redux/action/common/modal/index';
import { withApp } from '@src/hoc/app';
import PubSub from '@/service/pubSub';
// service
import { getItem } from '@/service/webStorageService';
// component
import NameBar from './nameBar';
import PriceBar from './priceBar';
import Description from './description/index';
import EditBtn from './btns/editBtn';
import BtnGroupBar from './btnGroupBar';
// redux
// style
import styles from './ItemDetailPanel.less';


@defineModuleName('ItemDetailPanel')
@withRouter
@withApp(context => ({ openMenu: context.openMenu }))
@connect(
  state => ({
    isLogin: state.userModel.isLogin
  }),
  dispatch => ({
    openModal: payload => {
      dispatch(settingGlobalModal(payload));
    }
  })
)
export default class ItemDetailPanel extends PureComponent {
  static propTypes = {
    // from redux
    openModal: PropTypes.func,
    openMenu: PropTypes.func,
    // props
    itemInfo: PropTypes.instanceOf(Object)
  }

  static contextTypes = {
    // funcs
    _analyze: PropTypes.func
  }

  static defaultProps = {
    itemInfo: {},
    openModal: () => {},
    openMenu: () => {}
  }

  constructor(props) {
    super(props);
    this.state = {
      showSendPanel: false, // 发送面板
      itemDetailModalVisible: false
    };
    this.sendPanel = null;
    this.sendBtnEl = null;
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

    const newPartialItemInfo = { ...partialItemInfo, ...attached };
    PubSub.publish('updateItemInfo', newPartialItemInfo);
    PubSub.publish('item', newPartialItemInfo);
  }

  statistics = () => {
    const { _analyze } = this.context;
    _analyze({ category: 'ItemViewer', action: 'ClickOfficialWebSite', label: '' });
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
      img: require('@src/images/1.x/btn_icon_warning_h.png'),
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

  toggleItemEditorModal = () => {
    const { itemDetailModalVisible } = this.state;
    this.setState({
      itemDetailModalVisible: !itemDetailModalVisible
    });
  }

  itemDetailEditorConfirm = () => {
    this.toggleItemEditorModal();
  }

  render() {
    const {
      moduleName,
      itemInfo
    } = this.props;
    const { showSendPanel, itemDetailModalVisible } = this.state;
    const {
      name, owner
      // itemPrice
    } = itemInfo;
    const { id: itemOwnerId } = owner || {};

    const isMyItem = itemOwnerId === getItem('id');

    return (
      <CommonPanel className={styles['item-detail']}>
        <NameBar
          name={name || ''}
        />
        <PriceBar
          itemInfo={itemInfo}
        />
        <Description
          itemInfo={itemInfo}
          statistics={this.statistics}
        />
        <div styleName="btns-wrapper">
          {/* 我的单品 - 编辑按钮 */}
          {
            isMyItem ? (
              <EditBtn
                toggleItemEditorModal={this.toggleItemEditorModal}
              />
            ) : null
          }
        </div>
        <BtnGroupBar
          itemInfo={itemInfo}
          sendBtnEl={el => { this.sendBtnEl = el; }}
          _onSend={this._onSend}
          _onMore={this._onMore}
          onCollect={this.onCollect}
        />
        <div ref={el => { this.sendPanel = el; }}>
          <SendMessageBox
            type="item"
            brandContainerId="" // 请求供应商列表用(用户单品没有)
            info={itemInfo} // 私信用
            show={showSendPanel}
            closeShareBox={this.closeSendBox}
          />
        </div>
        {/* 编辑单品详情弹窗 */}
        {itemDetailModalVisible && (
          <ItemDetailEditorModal
            closeItemEditorModal={this.toggleItemEditorModal}
            visible={itemDetailModalVisible}
            itemInfo={itemInfo}
            isInEdit={false}
            moduleName={moduleName}
            confirm={this.itemDetailEditorConfirm}
          />
        )}
      </CommonPanel>
    );
  }
}
