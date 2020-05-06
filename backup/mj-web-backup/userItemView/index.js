import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import Message from '@meijian/message';
import SeoHead from '@meijian/seo-head';
import PubSub from 'Service/pubSub';
import networkService from 'Service/networkService';
import { defineModuleName } from '@src/core/point';
import RichDetail from '@src/components/mall/richDetail';
import ItemFrame from '@src/pages/detailViewer/userItemView/itemFrame';
import ItemSummary from '@src/pages/detailViewer/userItemView/itemSummary';
import pubSubActions from '@src/const/pubSubActions';
import { fmtNumber } from '@src/core/price/utils';
import ItemLinkCheckRebateModal from '@src/components/item/checkRebate';
import Api from '@src/api';
import { getItem } from '@/service/webStorageService';
import LogMask from '@/components/common/logMask'; // 水印
import { postMessageService } from '@/service/postMessageService';
import CornerContainer from '@/components/common/layout/cornerContainer/';
import ToTop from '@/components/common/toTop';
import { ItemInfoContext } from './context/index';
import ItemsPanel from './itemsPanel';
import ItemListPanel from './itemListPanel';
import styles from './ItemViewer.less';

const BestMatchItemList = defineModuleName('BestMatch')(ItemListPanel);
const RelatedItemList = defineModuleName('RelatedItem')(ItemListPanel);

@connect(({ userModel }) => ({
  userInfo: userModel.userInfo || {}
}))
@withRouter
export default class ItemViewer extends PureComponent {
  debounceFetchTwoRecommendList = debounce(id => this.fetchTwoRecommendList(id), 1000);

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
      renderComments: false,
      rebateModalVisible: false,
      rebateInfo: {}, // 返利detail
      itemRebateLink: '' // 返利链接
    };
  }

  componentDidMount() {
    if (this.id) {
      this.initPageInfo(this.id);
    }
    PubSub.subscribe('refreshList', this.refreshList);
    PubSub.subscribe('updateItemInfo', this.updateItemInfo);
  }

  componentWillUnmount() {
    PubSub.clearSubscriptions(['refreshList', 'updateItemInfo', pubSubActions.BRAND_CONTAINER_AUTO_COLLECTED]);
  }

  /** @desc 初次获取页面数据，单品为维度 */
  initPageInfo = id => {
    const { location = {} } = this.props;
    const { state = {} } = location || {};

    if (state.itemInfo) {
      const { location: { state = {} } = {} } = this.props || {};
      this.fetchDetailLogic(Promise.resolve(state.itemInfo));
    } else {
      this.fetchDetail({ id, shouldUpdateList: true });
    }
  }

  /** @desc 【普通单品】重载 */
  reloadItemInfo = id => {
    this.fetchDetail({ id });
  }

  fetchDetailLogic = (promise, shouldUpdateList, shouldUpdateDebouncely) => {
    promise.then(res => {
      if (typeof res === 'object') {
        postMessageService.changeTabName(res.name || '单品');

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
      Message.error(m);
    });
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
    this.fetchDetailLogic(networkService.post({
      ...postParams,
      catchError: true
    }), shouldUpdateList, shouldUpdateDebouncely);
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
    // const testInfo = { ...info, imgs: ['00846cf31165132e1cf6993b1793fc7a.jpeg', '00846cf31165132e1cf6993b1793fc7a.jpeg'] };
    this.setState({
      itemInfo: { ...itemInfo, ...info },
      renderComments: true
    });

    // 不影响外围逻辑进行弹窗
    const { isFromEdit, link } = info;
    const { userInfo = {} } = this.props;
    const { id } = userInfo;
    const isMakred = getItem(`NO_MORE_CHECK_REBATE_${id}`);
    const isEffectiveLink = /(taobao|tmall)\.com/.test(link);
    if (isFromEdit && link && isEffectiveLink && (!isMakred || isMakred === 'false')) {
      networkService.ajax({
        url: Api.tbk.checkItemLinkRebate,
        data: {
          content: link
        }
      }).then(res => {
        if (res) {
          this.setState({
            rebateInfo: res,
            itemRebateLink: link
          }, () => {
            this.toggleItemRebateModal();
          });
        }
      });
    } else if (isFromEdit && isMakred === 'true') {
      Message.success('修改成功');
    }
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

  toggleItemRebateModal = () => {
    const { rebateModalVisible } = this.state;
    this.setState({
      rebateModalVisible: !rebateModalVisible
    });
  }

  render() {
    const { id } = this;
    const {
      itemInfo, itemRelatedList, usingByOthersList, renderComments,
      rebateModalVisible, rebateInfo, itemRebateLink
    } = this.state;
    const { id: itemId, name, brand, categoryFullname, categoryName, price, series } = itemInfo || {};

    // seo
    const categoryPath = (categoryFullname || []).join('-');
    const seoDesc = [name, categoryPath, price > 0 ? `价格${fmtNumber(price / 100, 'round', 2)}元` : '', series].filter(v => !!v);
    const seoKeywords = ['美间', '软装设计采购助手', '软装供应商', brand, categoryName].filter(v => !!v);

    return (
      <>
        <div
          styleName="item-viewer"
        >
          {
            itemId && (
              <SeoHead
                title={name ? `${name}-单品` : '单品'}
                hasTitleSuffix
                description={seoDesc.join(',')}
                keywords={seoKeywords.join(',')}
              />
            )
          }
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
        <ItemLinkCheckRebateModal
          visible={rebateModalVisible}
          toggleModal={this.toggleItemRebateModal}
          rebateInfo={rebateInfo}
          itemRebateLink={itemRebateLink}
          moduleName="ItemDetailPanel"
        />
      </>
    );
  }
}
