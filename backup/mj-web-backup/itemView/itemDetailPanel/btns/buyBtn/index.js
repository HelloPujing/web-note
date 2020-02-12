import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import * as clientService from '@/service/clientShellService';
import { checkLogin } from '@src/core/userUtils';
import { convertLinkToELink } from '@/service/utilService';
import { postMessageService } from '@/service/postMessageService';
// import networkService from '@/service/networkService';
// import Api from '@/api';
import './buyBtn.less';

const propTypes = {
  moduleName: PropTypes.string.isRequired,
  itemInfo: PropTypes.instanceOf(Object).isRequired,
  _collectDataBuyItem: PropTypes.func.isRequired
};

/**
 * @desc 普通购买按钮
 *
 */
class BuyBtn extends PureComponent {
  // 普通购买
  buyItem = () => {
    const { moduleName, itemInfo, _collectDataBuyItem } = this.props;
    // 埋点
    _collectDataBuyItem(itemInfo, 'redirectToBuyItem');

    if (!checkLogin()) return;

    const { link } = itemInfo || {};

    if (!link) {
      return;
    }

    const url = convertLinkToELink(itemInfo, { m: moduleName });
    postMessageService.addTab({
      url
    }, true);

    // let newWindow;
    // const { isInClient } = clientService.shell;
    // if (!isInClient) {
    //   newWindow = window.open('about:blank');
    // }
    // this.requestTbkLink({
    //   moduleName, itemInfo, url, isInClient, newWindow
    // });
  };

  // requestTbkLink = ({
  //   moduleName, itemInfo, url, isInClient, newWindow
  // }) => {
  //   networkService.post({
  //     url: Api.Item.tbklink,
  //     data: {
  //       itemId: itemInfo.id,
  //       link: itemInfo.link,
  //       p: 1,
  //       m: moduleName
  //     },
  //     catchError: true,
  //     success: () => {
  //       /*
  //       const {
  //         link
  //       } = res;
  //       */
  //       // API返回
  //       if (isInClient) {
  //         window.open(url);
  //       } else {
  //         newWindow.location.href = url;
  //       }
  //     },
  //     error: (m, c, r) => {
  //       if (!isInClient) {
  //         newWindow.location.href = url;
  //       } else {
  //         r && r.link && window.open(url);
  //       }
  //     }
  //   });
  // }

  render() {
    return (
      <div
        styleName="buy-btn"
        onClick={this.buyItem}
      >
        去购买
      </div>
    );
  }
}

BuyBtn.propTypes = propTypes;

export default BuyBtn;
