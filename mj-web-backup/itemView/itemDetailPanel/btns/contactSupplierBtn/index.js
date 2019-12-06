import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineUseModuleName, collectData } from '@src/core/point';
import LinkToService from '@src/services/route/linkToService';
import './contactSupplierBtn.less';

/**
 * @desc 联系供应商按钮
 *
 */

const propTypes = {
  itemInfo: PropTypes.instanceOf(Object).isRequired
};

@defineUseModuleName
class ContactSupplierBtn extends PureComponent {
  /**
   * @desc 联系供应商
   */
  contactSupplier = () => {
    const { itemInfo, moduleName } = this.props;

    // 品牌页优化-新增埋点
    collectData({
      moduleName,
      key: 'contactSupplier',
      info: {
        brandContainerId: itemInfo.userId
      }
    });

    LinkToService.brandUser({
      id: itemInfo.userId,
      tab: 'shop'
    });
  }

  render() {
    return (
      <div
        styleName="contact-supplier-btn"
        onClick={this.contactSupplier}
      >
        联系供应商
      </div>
    );
  }
}

ContactSupplierBtn.propTypes = propTypes;

export default ContactSupplierBtn;
