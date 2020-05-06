import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import LinkToService from '@src/services/route/linkToService';
import { collectData } from '@src/core/point';
import { SKU_TYPE } from 'Service/constService';
import ItemBox from '@src/components/item/box';
import { settingGlobalModal } from '@src/redux/action/common/modal';
import './ItemListPanel.less';

const propTypes = {
  className: PropTypes.string,
  list: PropTypes.instanceOf(Array),
  shouldBrowseList: PropTypes.bool
};

const defaultProps = {
  className: null,
  list: [],
  shouldBrowseList: false
};

class ItemListPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list,
      renderBox: []
    };
  }

  componentDidMount() {
    const { list, shouldBrowseList } = this.props;
    this.setState({
      renderBox: shouldBrowseList ? list : list.slice(0, 8)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { list, shouldBrowseList } = this.props;
    if (list !== nextProps.list) {
      this.setState({
        list: nextProps.list,
        renderBox: shouldBrowseList ? nextProps.list : nextProps.list.slice(0, 8)
      });
    }
  }

  /**
   * @desc 点击单品，查看详情
   */
  // onClickItem = itemInfo => {
  //   // const { moduleName } = this.props;
  //   const { id, copyFrom } = itemInfo || {};
  //   LinkToService.item({
  //     id: copyFrom || id
  //   });
  //   // collectData({ moduleName, key: 'clickItemDetail', info: { itemId: id } });
  // }

  refreshList = () => {
    const { moduleName } = this.props;
    let { list } = this.state;
    // PubSub.publish('refreshList', list);
    list = list.slice(8).concat(list.slice(0, 8));
    this.setState({ list, renderBox: list.slice(0, 8) });
    collectData({ moduleName, key: 'change', info: {} });
  }

  render() {
    const { className = '', userInfo, updateItemListInfo } = this.props;
    const authUser = userInfo.isCommissionUser;
    let { renderBox } = this.state;
    const refreshBtnShown = className && className.indexOf('one-line') !== -1;
    renderBox = renderBox || [];

    return (
      <div style={{ position: 'relative' }}>
        <section className={className} styleName="item-list-panel">
          {
            renderBox && renderBox.map((itemInfo, index) => {
              if (!itemInfo) return null;
              return (
                <ItemBox
                  key={itemInfo.id}
                  index={index}
                  forcedStyle={(itemInfo.skuId > 0 ? { recommend: false } : null)}
                  data={{ object: itemInfo, type: SKU_TYPE.ITEM }}
                  isVip={authUser}
                  watch={item => updateItemListInfo(item.object)}
                />
              );
            })
          }
        </section>
        {
          refreshBtnShown ? <span styleName="refresh-btn" onClick={this.refreshList}>换一换</span> : null
        }
      </div>
    );
  }
}

ItemListPanel.propTypes = propTypes;
ItemListPanel.defaultProps = defaultProps;

export default connect(
  state => ({
    userInfo: state.userModel.userInfo
  }),
  dispatch => {
    return {
      openModal: ({ type, builtInProps }) => {
        dispatch(settingGlobalModal({ isOpen: true, type, builtInProps }));
      }
    };
  }
)(ItemListPanel);
