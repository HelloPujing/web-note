import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import PubSub from 'Service/pubSub';
import networkService from 'Service/networkService';
import { defineModuleName } from '@src/core/point';
import ItemFrame from '@src/pages/detailViewer/itemView/itemFrame';
import ItemSummary from '@src/pages/detailViewer/itemView/itemSummary';
import CommentsPanel from '@src/pages/detailViewer/components/commentsPanel';
import pubSubActions from '@src/const/pubSubActions';
import LogMask from '@/components/common/logMask'; // 水印
import { postMessageService } from '@/service/postMessageService';
import Message from '@/components/widgets/message';
import RichDetail from '@/components/common/mall/richDetail';
import Api from '@/api';
import CornerContainer from '@/components/common/layout/cornerContainer/';
import ToTop from '@/components/common/toTop';
import { ItemInfoContext } from './context/index';
import ItemsPanel from './itemsPanel';
import ItemListPanel from './itemListPanel';
import styles from './ItemViewer.less';

const BestMatchItemList = defineModuleName('BestMatch')(ItemListPanel);
const RelatedItemList = defineModuleName('RelatedItem')(ItemListPanel);

@withRouter
export default class ItemViewer extends PureComponent {
  debounceFetchTwoRecommendList = debounce(id => this.fetchTwoRecommendList(id), 1000);

  static childContextTypes = {
    brandCollect: PropTypes.func
  }

  constructor(props) {
    super(props);
    const { match: { params: { id } } } = this.props;
    this.id/* 路由带入的id */ = id;
    this.itemViewer = null;
    this.itemContext/* 子组件context */ = {
      reloadItemInfo: this.reloadItemInfo
    };
    this.state = {
      itemInfo: /* 单品详情信息 */{
        readyDeleted: false
      },
      itemRelatedList: /* 相似单品 */ [],
      usingByOthersList: /* 热门搭配 */ [],
      renderComments: false
    };
  }

  getChildContext() {
    return {
      brandCollect: this.brandCollect
    };
  }

  componentDidMount() {
    if (this.id) {
      this.initPageInfo(this.id);
    }
    PubSub.subscribe('refreshList', this.refreshList);
    PubSub.subscribe('updateItemInfo', this.updateItemInfo);
    PubSub.subscribe(pubSubActions.BRAND_CONTAINER_AUTO_COLLECTED, this.updateItemBrandInfo);
  }

  componentWillUnmount() {
    PubSub.clearSubscriptions(['refreshList', 'updateItemInfo', pubSubActions.BRAND_CONTAINER_AUTO_COLLECTED]);
  }

  /** @desc 初次获取页面数据，单品为维度 */
  initPageInfo = id => {
    this.fetchDetail({ id, shouldUpdateList: true });
  }

  /** @desc 【普通单品】重载 */
  reloadItemInfo = id => {
    this.fetchDetail({ id });
  }

  /** @desc 通用。单品or同款单品获取信息，返回数据结构一致 */
  fetchDetail = (
    {
      id /* 单品id */,
      shouldUpdateList /* 是否需要更新2个推荐列表（eg.同款单品) */,
      shouldUpdateDebouncely /* 是否要防抖更新列表 （eg.同款单品) */
    }
  ) => {
    const postParams = {
      url: Api.itemDetail,
      data: { id }
    };
    this.setState({
      renderComments: false
    });
    networkService.post({
      ...postParams,
      catchError: true
    }).then(res => {
      if (typeof res === 'object') {
        postMessageService.changeTabName(res.name || '单品');

        /** 不显示同步单品 */
        if (res.skuId > 0) {
          this.updateItemInfo({ readyDeleted: true });
          console.error('同步单品不允许访问');
          return;
        }

        this.updateItemInfo({ ...res, readyDeleted: false });
        /**
         * 更新两个推荐列表
         * 返回的都是统一的单品info结构
         * */
        if (shouldUpdateList) {
          const { id } = res || {};
          const requestListFunc = shouldUpdateDebouncely ? this.debounceFetchTwoRecommendList : this.fetchTwoRecommendList;
          requestListFunc(id);
        }
      }
    }).catch(({ m, c }) => {
      if (
        c === 2001 || // 单品已删除
        c === -1001 // 参数错误（地址栏乱写id）
      ) {
        this.updateItemInfo({ readyDeleted: true });
      }
      Message.toast(m);
    });
  }

  /** @desc 两个单品推荐列表 */
  fetchTwoRecommendList = id => {
    [
      {
        url/* 相似单品 */: Api.Item.similar,
        state: 'itemRelatedList'
      }, {
        url/* 热门搭配 */: Api.Item.hotCollocation,
        state: 'usingByOthersList'
      }
    ].forEach(request => {
      networkService.post({
        url: request.url,
        data: { id },
        catchError: true
      })
        .then(res => {
          if (Array.isArray(res)) {
            this.setState({
              [request.state]: res
            });
          }
        })
        .catch(() => { // 接口失败，列表置空
          this.setState({
            [request.state]: []
          });
        });
    });
  }

  updateItemInfo = info => {
    const { itemInfo } = this.state;
    this.setState({
      itemInfo: { ...itemInfo, ...info },
      renderComments: true
    });
  }

  // 订阅'品牌自动收藏'处理函数
  updateItemBrandInfo = brandContainerId => {
    const { itemInfo } = this.state;
    const { owner: { id, collect } = {} } = itemInfo || {};
    if (
      id
      && id === brandContainerId
      && !collect // 防止不必要的渲染
    ) {
      const newOwner = { ...itemInfo.owner, collect: true };
      this.updateItemInfo({ owner: newOwner });
    }
  }

  brandCollect = info => {
    const { collect } = info;

    this.setState(prevState => {
      const { itemInfo } = prevState;
      const { owner } = itemInfo || {};
      return {
        itemInfo: {
          ...itemInfo,
          owner: { ...owner, collect }
        }
      };
    });
  }

  /** @desc 两个推荐列表，换一换功能，取8个 */
  refreshList = list => {
    const { itemRelatedList, usingByOthersList } = this.state;
    switch (true) {
      case list === itemRelatedList:
        this.setState({ itemRelatedList: list.slice(8).concat(list.slice(0, 8)) });
        break;
      case list === usingByOthersList:
        this.setState({ usingByOthersList: list.slice(8).concat(list.slice(0, 8)) });
        break;
      default:
        break;
    }
  }

  /** @desc 如果两个推荐列表中，有入参内的item，则更新成入参的item的信息  */
  updateListInfo = itemInfo => {
    const { itemRelatedList, usingByOthersList } = this.state;
    for (let i = 0, len = itemRelatedList.length; i < len; i++) {
      const _itemInfo = itemRelatedList[i];
      if (_itemInfo.id === itemInfo.id) {
        const _itemRelatedList = itemRelatedList.slice();
        _itemRelatedList[i] = { ..._itemInfo, ...itemInfo };
        this.setState({ itemRelatedList: _itemRelatedList });
      }
    }
    for (let i = 0, len = usingByOthersList.length; i < len; i++) {
      const _itemInfo = usingByOthersList[i];
      if (_itemInfo.id === itemInfo.id) {
        const _usingByOthersList = usingByOthersList.slice();
        _usingByOthersList[i] = { ..._itemInfo, ...itemInfo };
        this.setState({ usingByOthersList: _usingByOthersList });
      }
    }
  }

  render() {
    const { id } = this;
    const {
      itemInfo, itemRelatedList, usingByOthersList, renderComments
    } = this.state;

    return (
      <>
        <div
          styleName="item-viewer"
        >
          <div styleName="content">
            <div
              styleName="main-body"
              ref={el => { this.itemViewer = el; }}
            >
              <ItemInfoContext.Provider value={this.itemContext}>
                <div styleName="booth">
                  {/* 主图模块 */}
                  <div styleName="frame">
                    <ItemFrame
                      id={id}
                      info={itemInfo}
                    />
                  </div>
                  {/* 侧边信息 */}
                  {
                    !itemInfo.readyDeleted ? (
                      <aside styleName="aside">
                        {
                          id && (
                            <ItemSummary
                              info={itemInfo}
                            />
                          )
                        }
                      </aside>
                    ) : null
                  }
                </div>
              </ItemInfoContext.Provider>

              {/* 富文本 */}
              {
                itemInfo.detailFileName ? (
                  <RichDetail
                    htmlName={itemInfo.detailFileName}
                    className={styles['item-rich--big']}
                  />
                ) : null
              }

              {/* 相似单品 */}
              {
                renderComments && !itemInfo.readyDeleted && (itemRelatedList && itemRelatedList.length) ? (
                  <ItemsPanel title="相似单品">
                    <RelatedItemList
                      className={styles['one-line']}
                      list={itemRelatedList}
                      updateItemListInfo={this.updateListInfo}
                    />
                  </ItemsPanel>
                ) : null
              }

              {/* 热门搭配 */}
              {
                renderComments && !itemInfo.readyDeleted && (usingByOthersList && usingByOthersList.length) ? (
                  <ItemsPanel title="热门搭配">
                    <BestMatchItemList
                      className={styles['one-line']}
                      list={usingByOthersList}
                      updateItemListInfo={this.updateListInfo}
                    />
                  </ItemsPanel>
                ) : null
              }

              {/* 评论 */}
              {
                (renderComments && !itemInfo.readyDeleted) ? (
                  <CommentsPanel
                    id={id}
                    type="item"
                  />
                ) : null
              }
            </div>
            {/* 右下角按钮 */}
            {
              this.itemViewer ? (
                <CornerContainer>
                  <ToTop
                    scrollEl={this.itemViewer}
                    theme="light"
                  />
                </CornerContainer>
              ) : null
            }
          </div>
        </div>
        <LogMask id={itemInfo.id} />
      </>
    );
  }
}
