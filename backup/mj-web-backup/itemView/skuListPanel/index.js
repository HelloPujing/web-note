import React from 'react';
import PropTypes from 'prop-types';
import networkService from '@/service/networkService';
import Api from '@/api';
import { ItemInfoContext } from '../context/index';
import SkuThumbnail from './skuThumbnail/index';
import './skuListPanel.less';


const propTypes = {
  productId/* 请求同款单品列表用 */: PropTypes.number,
  skuId/* 判断选中用 */: PropTypes.number
};
const defaultProps = {
  productId: '',
  skuId: ''
};

const STEP/* 索引步长 */ = 3;
const SHOW_NUM/* 显示个数 */ = 4;

/* 同款单品模块： 只有商品同步的单品（有productId & skuId）才有该模块 */
class SkuListPanel extends React.PureComponent {
  state = {
    index/* 开始索引 */: 0,
    skuList/* 同款单品[{skuId, itemId, image, productId}] */: []
  }

  componentDidMount() {
    const { productId } = this.props;
    if (!productId) return;

    networkService.post({
      url: Api.product.theSameSkus,
      data: {
        productId
      }
    }).then(r => {
      this.setState({
        skuList: r
      });
    });
  }

  // 上一页
  prev = () => {
    const { index } = this.state;
    const newIndex = index - STEP;
    this.setIndex(newIndex);
  }

  // 下一页
  next = () => {
    const { index } = this.state;
    const newIndex = index + STEP;
    this.setIndex(newIndex);
  }

  // CHANGE STATE: INDEX
  setIndex = _newIndex => {
    const { skuList = [] } = this.state;
    const maxIndex = skuList.length - 1;
    const minIndex = 0;
    let newIndex = _newIndex;

    newIndex = newIndex > maxIndex ? maxIndex : newIndex;
    newIndex = newIndex < minIndex ? minIndex : newIndex;

    this.setState({
      index: newIndex
    });
  }


  render() {
    const { skuId: currentItemSkuId } = this.props;
    const { index, skuList } = this.state;
    const partSkuList = skuList.slice(index, index + SHOW_NUM);
    // 箭头
    const showArrow = skuList.length > SHOW_NUM;
    const prevDisabled = index === 0;
    const nextDisabled = index >= skuList.length - STEP;

    if (!skuList || skuList.length <= 1) return null; // 无同款单品（只有1个说明是自己本身）不显示

    return (
      <div styleName="sku-list">
        <h1>同款单品</h1>
        <div styleName="sku-bar">
          <div
            style={showArrow ? null : { display: 'none' }}
            styleName="prev"
            data-disabled={prevDisabled}
            onClick={prevDisabled ? null : this.prev}
          />
          <ItemInfoContext.Consumer>
            {
              ({ reloadSkuItemInfo }) => (
                /* sku-container-left临时改方案 */
                <div styleName={showArrow ? 'sku-container-center' : 'sku-container-center'}>
                  {
                    partSkuList && partSkuList.map(sku => {
                      const { skuId, images } = sku || {};
                      const [image] = images || [];
                      return (
                        <SkuThumbnail
                          key={skuId}
                          image={image}
                          skuId={skuId}
                          selected={currentItemSkuId === skuId}
                          reloadSkuItemInfo={reloadSkuItemInfo}
                        />
                      );
                    })
                  }
                </div>
              )
            }
          </ItemInfoContext.Consumer>
          <div
            style={showArrow ? null : { display: 'none' }}
            styleName="next"
            data-disabled={nextDisabled}
            onClick={nextDisabled ? null : this.next}
          />
        </div>
      </div>
    );
  }
}

SkuListPanel.propTypes = propTypes;
SkuListPanel.defaultProps = defaultProps;

export default SkuListPanel;
