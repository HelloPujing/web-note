import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getColorName } from '@/service/utilService';
import './description.less';

const propTypes = {
  itemInfo: PropTypes.instanceOf(Object).isRequired,
  statistics: PropTypes.func.isRequired
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
      itemInfo, statistics
    } = this.props;
    const { hideInfo } = this.state;

    const {
      brand, series, categoryName, styleName, colorRates, material, size
    } = itemInfo || {};

    // 完整信息
    const desc = [
      { text: '材质', value: material },
      { text: '尺寸', value: size },
      { text: '风格', value: styleName },
      { text: '颜色', value: colorRates && colorRates.length > 0 && getColorName(colorRates[0].id) },
      { text: '品牌', value: brand },
      { text: '系列', value: series },
      { text: '分类', value: categoryName }
    ]
      .filter(item => { return !!item.value; });

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
          hideInfo && desc.length > 7
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

export default Description;
