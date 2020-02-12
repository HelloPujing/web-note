import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getColorName } from '@/service/utilService';
import './description.less';

const propTypes = {
  itemInfo: PropTypes.instanceOf(Object).isRequired,
  canBuy: PropTypes.bool,
  isBrandItem: PropTypes.bool,
  statistics: PropTypes.func.isRequired
};

const defaultProps = {
  canBuy: false,
  isBrandItem: false
};

class Description extends PureComponent {
  state = {
    hideInfo: false
  }

  // 详情介绍
  showFullDesc = () => {
    this.setState({
      hideInfo: false
    });
  }

  render() {
    const {
      itemInfo, canBuy, isBrandItem, statistics
    } = this.props;
    const { hideInfo } = this.state;

    const {
      brand, series, categoryName, styleName, colorRates, material, size, link, customize, outYears, model, designer, tag
    } = itemInfo || {};

    const brandItemInfo = [
      { text: '材质', value: material },
      { text: '尺寸', value: size },
      { text: '可定制', value: ['', '是', '否'][customize] },
      { text: '是否带框', value: tag && (tag.hasFrame === '1' ? '是' : tag.hasFrame === '2' ? '否' : '') },
      { text: '是否带光源', value: tag && (tag.hasLamp === '1' ? '是' : tag.hasLamp === '2' ? '否' : '') },
      { text: '设计师', value: designer },
      { text: '风格', value: styleName },
      { text: '颜色', value: colorRates && colorRates.length > 0 && getColorName(colorRates[0].id) },
      { text: '品牌', value: brand },
      { text: '系列', value: series },
      { text: '型号', value: model },
      { text: '分类', value: categoryName },
      { text: '年份', value: outYears }
    ];

    const userItemInfo = [
      { text: '材质', value: material },
      { text: '尺寸', value: size },
      { text: '风格', value: styleName },
      { text: '颜色', value: colorRates && colorRates.length > 0 && getColorName(colorRates[0].id) },
      { text: '品牌', value: brand },
      { text: '系列', value: series },
      { text: '分类', value: categoryName }
    ];

    // 完整信息
    let fullDesc = [];
    fullDesc = isBrandItem ? fullDesc.concat(brandItemInfo) : fullDesc.concat(userItemInfo);
    fullDesc = fullDesc.filter(item => { return !!item.value; });

    if (isBrandItem && !canBuy) {
      fullDesc.push({ text: '更多信息', value: link });
    }

    // 最终显示信息
    const desc = isBrandItem && hideInfo && fullDesc.length > 3 ? fullDesc.slice(0, 3) : fullDesc; // 只有[品牌页单品]过长才默认收起来

    return (
      <React.Fragment>
        {
          desc && desc.map(({ text, value }, i) => {
            if (!value) return null;
            if (text === '更多信息') {
              return (
                <p key={i} styleName="item-info">
                  <span>{text}</span>
                  <a
                    href={`${value}`}
                    styleName="link"
                    onClick={statistics}
                    rel="noopener noreferrer"
                    target="_blank"
                  >点击前往
                  </a>
                </p>
              );
            }
            return <p key={i} styleName="item-info"><span>{text}</span>{value}</p>;
          })
        }
        {
          isBrandItem && hideInfo && fullDesc.length > 3
            ? (
              <p styleName="item-info more" onClick={this.showFullDesc}>
                <span>更多描述</span>
              </p>
            ) : null
        }
      </React.Fragment>
    );
  }
}

Description.propTypes = propTypes;
Description.defaultProps = defaultProps;

export default Description;
