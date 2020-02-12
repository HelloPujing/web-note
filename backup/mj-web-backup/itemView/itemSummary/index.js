import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ACCOUNT_TYPE } from 'Service/constService';
import ItemDetailPanel from '@src/pages/detailViewer/itemView/itemDetailPanel';
import DesignerPanel from '@src/pages/detailViewer/components/designerPanel';
import AvatarsPanel from '@src/pages/detailViewer/components/avatarsPanel';
import { ItemInfoContext } from '../context/index';
import AuthProvideInfoPanel from '../authProvideInfoPanel';
import './index.less';

const propTypes = {
  info: PropTypes.instanceOf(Object),
  className: PropTypes.string
};

const defaultProps = {
  info: {},
  className: null
};

class ItemSummary extends PureComponent {
  componentDidMount() {
    const { scrollEl } = this.props;
    if (scrollEl) scrollEl.addEventListener('mousewheel', this._stopMouseWheel, false);
  }

  componentWillUnmount() {
    const { scrollEl } = this.props;
    if (scrollEl) scrollEl.removeEventListener('mousewheel', this._stopMouseWheel);
  }

  _stopMouseWheel = e => {
    const target = e.currentTarget;
    const delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) || (e.detail && (e.detail > 0 ? -1 : 1));
    e.stopPropagation();

    if (target.scrollTop >= target.scrollHeight - target.clientHeight) {
      if (delta < 0 && !document.getElementById('all_Users_Panel')) {
        e.preventDefault(e); // 下滚禁止 冒泡的上一级scrollEle
      }
    }
  }

  render() {
    const { className, scrollEl, holeCollect } = this.props;
    let { info } = this.props;
    info = info || {};
    const isBrand = info.ownerType === ACCOUNT_TYPE.BRAND;

    return (
      <div className={className} styleName="summary">
        <ItemInfoContext.Consumer>
          {
            ({ reloadItemInfo }) => {
              return (
                <ItemDetailPanel
                  itemInfo={info}
                  holeCollect={holeCollect}
                  scrollEl={scrollEl}
                  reloadItemInfo={reloadItemInfo}
                />
              );
            }
          }
        </ItemInfoContext.Consumer>
        {/* ALL单品：设计者、品牌 */}
        <DesignerPanel
          type="item"
          info={info}
        />
        {/* ALL单品：收藏的用户列表 */}
        <AvatarsPanel
          type="item"
          info={info}
        />
        {/* 用户单品：提供的链接等 */}
        {
          !isBrand ? (
            <AuthProvideInfoPanel
              info={info}
            />
          ) : null
        }
      </div>
    );
  }
}

ItemSummary.propTypes = propTypes;
ItemSummary.defaultProps = defaultProps;

export default ItemSummary;
