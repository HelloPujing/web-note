import React from 'react';
import PropTypes from 'prop-types';
import { RED_PACKET_STATE } from 'Service/constService';
import { BRAND_ITEM_SALE_TYPE } from 'Service/promotion/dpService';
import Popover from 'Components/widgets/popover';
import styles from './redPacketBar.less';

/**
 * @desc 红包 提示条
 *
 * 前置条件：销售类型页
 *
 * 未认证 （无论有无红包）：显示红包条目且悬浮出tip
 *
 * 已认证 + 有红包 + 未激活未下单 + ：显示红包条目且点击弹窗
 * 已认证 + 其他：不显示红包
 *
 * @example
 *
 */

const RedPacketBar = React.memo(props => {
  const {
    className,
    isCommissionUser, old, redPacketInfo, label, brandItemSaleType, openRedPacketDlg
  } = props;
  // 红包
  const { state } = redPacketInfo || {};
  const unActive = state && state === RED_PACKET_STATE.UNACTIVED;
  // 单品
  const isSaleType = (
    brandItemSaleType === BRAND_ITEM_SALE_TYPE.DP
    || brandItemSaleType === BRAND_ITEM_SALE_TYPE.DP_TBK
    || brandItemSaleType === BRAND_ITEM_SALE_TYPE.TBK
  );


  // 非销售类型页 或者 旧款
  if (!isSaleType || old) {
    return null;
  }

  // 已认证用户，显示红包的情况
  const commissionUserShowRedPacketBar = redPacketInfo && unActive;
  if (isCommissionUser && !commissionUserShowRedPacketBar) {
    return null;
  }

  return (
    <div
      styleName="red-packet-bar"
      className={className}
    >
      {label}
      <span styleName="content">
        <i styleName="red-packet-icon" />
        {
          !isCommissionUser ? ( // 非认证用户，不管有没有红包
            <>
              <span>认证即领20元现金</span>
              <Popover
                theme="dark"
                popperClass={styles['help-popover']}
                trigger="hover"
                placement="bottom"
                visibleArrow
                content="认证成功后，平台将在1-3个工作日发送20元现金红包，您通过美间完成首次采购，即可提现该现金红包"
              >
                <i styleName="help-icon" />
              </Popover>
            </>
          ) : ( // 认证用户
            <>
              <span>下单立提20元现金</span>
              <i
                styleName="help-icon"
                onClick={typeof openRedPacketDlg === 'function' ? openRedPacketDlg : null}
              />
            </>
          )
        }
      </span>
    </div>
  );
});


RedPacketBar.propTypes = {
  className: PropTypes.string,
  isCommissionUser: PropTypes.bool,
  redPacketInfo: PropTypes.instanceOf(Object),
  label: PropTypes.node,
  brandItemSaleType: PropTypes.string.isRequired,
  openRedPacketDlg: PropTypes.func
};

RedPacketBar.defaultProps = {
  className: null,
  isCommissionUser: false,
  redPacketInfo: {},
  label: null,
  openRedPacketDlg: () => {}
};

export default RedPacketBar;
