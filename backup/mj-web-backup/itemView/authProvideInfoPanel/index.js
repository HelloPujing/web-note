import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Avatar from 'Components/common/avatar';
import { collectData, defineModuleName, defineUseModuleName } from '@src/core/point';
import networkService from 'Service/networkService';
import { getShoppingLinkText } from 'Service/utilService';
import { ACCOUNT_TYPE } from 'Service/constService';
import { version } from 'Service/appVersionService';
import { getItem } from 'Service/webStorageService';
import getUserProfileURL from '@src/core/getUserProfileURL';
import { postMessageService } from '@/service/postMessageService';
import styles from './authProvideInfoPanel.less';

const { USER, BRAND } = ACCOUNT_TYPE;

/**
 * @desc 单品详情用户提供链接面板
 *
 * 备注: 迁移先人老代码到src
 * 已完成：修复eslint、删除废弃的多余逻辑
 * 未完成：不合理命名、功能注释、老旧语法、冗杂的逻辑等
 *
 */


const propTypes = {
  itemId: PropTypes.string,
  shoppingInfo: PropTypes.instanceOf(Object),
  withTopic: PropTypes.bool,
  online: PropTypes.bool
};

const defaultProps = {
  itemId: '',
  shoppingInfo: {},
  withTopic: false,
  online: false
};

@defineUseModuleName
class SaleLine extends PureComponent {
  static contextTypes = {
    moduleName: PropTypes.string,
    addToStorage: PropTypes.func,
    _analyze: PropTypes.func
  }

  toUserPage = (e, userInfo) => {
    const { shoppingInfo: { supplierId } } = this.props;
    this.buryPoint(supplierId);
    e.stopPropagation();
    postMessageService.addTab({
      url: getUserProfileURL(userInfo)
    });
  }

  statistics = e => {
    const { moduleName, itemId, shoppingInfo: { linkUrl, user, supplierId }, online } = this.props;
    const { _analyze } = this.context;
    if (!online) {
      this.toUserPage(e, user);
      return;
    }
    e.stopPropagation();

    _analyze({ category: 'ItemViewer', action: 'ClickItemExLink', label: '' });
    collectData({ moduleName, key: 'clickItemExLink', info: { itemId, supplierId, link: encodeURIComponent(linkUrl) } });
  }

  buryPoint = () => {
    const { itemId, shoppingInfo: { user, supplierId } } = this.props;
    const { addToStorage } = this.context;
    const data = {
      userId: getItem('id'),
      type: 'event',
      timestamp: new Date().getTime().toString(),
      appVersion: version.appVersion,
      fromModuleName: this.eventModuleName,
      moduleParamId: supplierId,
      info: {
        key: 'EnterSupplierMainPage',
        itemId,
        supplier_id: supplierId
      }
    };
    if (user && user.id) addToStorage(data, true);
  }

  render() {
    const { shoppingInfo: { marketName, user }, withTopic, online, ownerType } = this.props;
    let { shoppingInfo: { linkUrl } } = this.props;
    linkUrl = linkUrl || 'javascript:void(0);'; // eslint-disable-line
    return (
      <li
        styleName="sale-line"
        onClick={
            e => {
              if (ownerType === BRAND) {
                this.toUserPage(e, user);
              } else {
                postMessageService.addTab({
                  url: linkUrl
                }, true);
              }
            }}
      >
        {
          withTopic ? <span styleName="topic">{online ? '线上' : '线下'}</span> : null
        }
        <span styleName="linkBox">
          <a
            styleName="link"
            data-can-link={online}
            href={online ? linkUrl : 'javascript:void(0);'} // eslint-disable-line
            target="_blank" // eslint-disable-line
            draggable={false}
            onClick={this.statistics}
          >
            {online && !marketName ? getShoppingLinkText(linkUrl) : marketName}
          </a>
        </span>
        {
          user ? (
            <Avatar
              className={styles.avatar}
              userInfo={user}
              columns={['shop', 'smallLogo']}
              onClick={this.toUserPage}
              preventDefault
              withTitle
            />
          ) : null
        }
      </li>
    );
  }
}

SaleLine.propTypes = propTypes;
SaleLine.defaultProps = defaultProps;


@defineModuleName('AuthProvideInfoPanel')
class AuthProvideInfoPanel extends PureComponent {
  constructor(props) {
    super(props);
    const { info: { link, ownerType } } = props;
    this.state = {
      onlineList: ownerType === BRAND ? [] : link ? [{ linkUrl: link }] : [],
      entityList: []
    };
  }

  componentDidMount() {
    const { info } = this.props;
    const { ownerType, id } = info || {};
    if (ownerType === BRAND && id) this.fetchSales(info.id);
  }

  componentWillReceiveProps(nextProps) {
    const { info } = this.props;
    const { info: nextInfo } = nextProps;
    if (nextInfo !== info) {
      if (nextInfo.ownerType === BRAND) this.fetchSales(nextInfo.id);
      if (nextInfo.ownerType === USER) {
        this.setState({
          onlineList: nextProps.info.link ? [{ linkUrl: nextInfo.link }] : [],
          entityList: []
        });
      }
    }
  }

  fetchSales = id => {
    networkService.post({
      url: '/item/saleInfo',
      data: { id },
      success: r => {
        const onlineList = [];
        const entityList = [];
        (r || []).forEach(shopping => {
          if (shopping.onlineType === 1) onlineList.push(shopping);
          if (shopping.onlineType === 2) entityList.push(shopping);
        });
        this.setState({ onlineList, entityList });
      }
    });
  }

  render() {
    const { info: { id, ownerType } } = this.props;
    const { onlineList, entityList } = this.state;
    return onlineList.length || entityList.length ? (
      <div className={styles['sales-panel']}>
        <p styleName="title">{ownerType === BRAND ? '推荐购买方式' : '发布者提供的购买链接'}</p>
        {
          onlineList.length ? (
            <ul styleName="sale-list">
              {
                onlineList.map((shoppingInfo, i) => (
                  <SaleLine
                    key={i}
                    itemId={id}
                    shoppingInfo={shoppingInfo}
                    withTopic={i === 0}
                    online
                    ownerType={ownerType}
                  />
                ))
              }
            </ul>
          ) : null
        }
        {
          entityList.length ? (
            <ul styleName="sale-list">
              {
                entityList.map((shoppingInfo, i) => (
                  <SaleLine
                    key={i}
                    itemId={id}
                    shoppingInfo={shoppingInfo}
                    withTopic={i === 0}
                    online={false}
                    ownerType={ownerType}
                  />
                ))
              }
            </ul>
          ) : null
        }
      </div>
    ) : null;
  }
}

AuthProvideInfoPanel.propTypes = {
  info: PropTypes.instanceOf(Object)
};
AuthProvideInfoPanel.defaultProps = {
  info: {}
};

export default AuthProvideInfoPanel;
