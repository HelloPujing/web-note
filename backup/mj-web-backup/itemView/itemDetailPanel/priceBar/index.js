import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PriceUtils from '@src/core/price/index';
import {
  BRAND_ITEM_SALE_TYPE,
  detectBrandItemType
} from 'Service/promotion/dpService';
import Popover from '@/components/widgets/popover';
import './itemPrice.less';

const THEME = {
  ROSE: '#E0557F',
  BLUE: '#01ACF3',
  BLACK: '#3B454C'
};

/**
 * @desc 价格条，单位全为元
 *
 */

const propTypes = {
  itemInfo: PropTypes.instanceOf(Object).isRequired,
  brandItemShowPrice: PropTypes.bool.isRequired,
  isCommissionUser: PropTypes.bool,
  isBrandItem: PropTypes.bool,
  // chatToBuyItem: PropTypes.func.isRequired,
  openAuthGuideDlg: PropTypes.func.isRequired
};

const defaultProps = {
  isCommissionUser: false,
  isBrandItem: true
};

class PriceBar extends PureComponent {
  render() {
    const {
      itemInfo, brandItemShowPrice, isCommissionUser, isBrandItem, openAuthGuideDlg
      // chatToBuyItem
    } = this.props;
    const {
      old, itemPrice, priceUnit, commissionRate
      // dpUserPrice, dpCommissionRate
    } = itemInfo;

    let priceLabel; // 价格标题
    let salePrice; // 实际售价
    let priceTheme = THEME.BLACK;
    let deletePrice; // 划掉的价格
    let discountTagValue; // 折扣
    // rebatePriceValue, //返现
    let rebatePercentValue; // 返百分比
    let showRebateTag; // 返百分比
    let tipText; // 显示价格提示
    // let showChatBtn; // 显示咨询按钮
    let showOldTag; // 显示old标签

    let showUnauthGuideBar = false;
    // let unauthTitle; // 未认证引导标题
    // let unauthContent; // 未认证引导内容

    if (old) { // 旧款
      priceLabel = '零售价';
      salePrice = itemPrice;
      showOldTag = true;
    } else {
      const brandItemSaleType = detectBrandItemType(itemInfo);
      switch (brandItemSaleType) {
        // 直采
        // case BRAND_ITEM_SALE_TYPE.DP:
        // case BRAND_ITEM_SALE_TYPE.DP_TBK:
        // if (isCommissionUser) { // 直采认证
        //   priceLabel = '直采价';
        //   salePrice = dpUserPrice;
        //   priceTheme = THEME.BLACK;
        //   deletePrice = itemPrice;
        //   discountTagValue = PriceUtils.fmtDiscount((1 - dpCommissionRate) * 10);
        //   tipText = discountTagValue ? '直接享受折后价，无需原价购买再返佣金，更加方便划算' : null;
        // } else { // 直采未认证
        //   priceLabel = '零售价';
        //   salePrice = itemPrice;
        //   priceTheme = THEME.BLACK;
        //   showUnauthGuideBar = true;
        //   unauthTitle = '会员价';
        //   unauthContent = '仅认证设计师可见';
        // }
        // break;
        // 仅淘宝客
        case BRAND_ITEM_SALE_TYPE.DP_TBK:
        case BRAND_ITEM_SALE_TYPE.TBK:
          priceLabel = '零售价';
          salePrice = itemPrice;
          priceTheme = THEME.BLACK;
          rebatePercentValue = PriceUtils.calcRebatePercent(commissionRate);
          showRebateTag = commissionRate > 0;
          tipText = '具体返佣金额按照实际成交价格与比例进行计算';

          if (!isCommissionUser) showUnauthGuideBar = true;
          break;
        // 普通品牌单品
        case BRAND_ITEM_SALE_TYPE.COMMON:
          priceLabel = '零售价';
          salePrice = itemPrice;
          priceTheme = THEME.BLACK;
          break;
        default:
          break;
      }
    }

    // 实际售价
    const { separatePrice, $detailRule: { fmtPrice } } = PriceUtils;
    const [salePriceInt, salePriceDecimal] = separatePrice(fmtPrice(salePrice));

    // 用户单品
    if (!isBrandItem) {
      return (
        itemPrice ? (
          <React.Fragment>
            <div styleName="price-bar">
              <div styleName="left-price">
                <span>
                  {`¥${itemPrice}`}
                </span>
              </div>
            </div>
          </React.Fragment>
        ) : null
      );
    }

    // 品牌单品
    if (!brandItemShowPrice) {
      return (
        <div styleName="price-bar">
          <div styleName="left-price">
            <span styleName="item-price-label">需询价</span>
          </div>
        </div>
      );
    }

    if (showOldTag) {
      return (
        <div styleName="price-bar">
          <div styleName="left-price">
            <div styleName="old-tag">已停售</div>
          </div>
        </div>
      );
    }


    if (Number(itemPrice) === 0) return null;

    return (
      <>
        {/* 价格+引导 */}
        <div styleName="price-bar">
          {/* 左侧价格条 */}
          <div styleName="left-price">
            {/* 标签（参考价、直采价、零售价） */}
            <span styleName="item-price-label">{priceLabel}</span>
            {/* 实际售价+单位 */}
            <span
              styleName="sale-price"
              style={{ color: priceTheme }}
            >
              <span>¥</span>
              <span>{salePriceInt}</span>
              <span styleName="decimal-part">{salePriceDecimal}</span>
            </span>
            {
              priceUnit ? <span styleName="unit">{priceUnit}</span> : null
            }
            {/* 废弃返现(tbk) */}
            {/* { */}
            {/* rebatePriceValue ? <span styleName="minus">-{rebatePriceValue}</span> : null */}
            {/* } */}
            {/* 划掉的价格(直采) */}
            {
              deletePrice ? <span styleName="delete-price">¥{deletePrice}</span> : null
            }
            {/* 返百分比(tbk) */}
            {
              rebatePercentValue ? <div styleName="rebate-scale">返{rebatePercentValue}%</div> : null
            }
            {/* 会员返利tag(tbk) */}
            {
              showRebateTag ? <div styleName="rebate-scale-tag">会员返利</div> : null
            }
            {/* 折扣（直采） */}
            {
              discountTagValue ? <span styleName="discount-tag">{discountTagValue}折</span> : null
            }
            {/* [?]价格说明 */}
            {
              tipText ? (
                <Popover
                  theme="dark"
                  trigger="hover"
                  placement="bottom"
                  content={tipText}
                >
                  <i styleName="help-icon" />
                </Popover>
              ) : null
            }
          </div>
          {/* 右侧标签 */}
          <div>{null}</div>
        </div>
        {/* 未认证引导部分 */}
        {
          showUnauthGuideBar ? (
            <div styleName="unauth-guide-bar">
              <a onClick={openAuthGuideDlg}>免费成为认证设计师会员<i /></a>
            </div>
          ) : null
        }
      </>
    );
  }
}

PriceBar.propTypes = propTypes;
PriceBar.defaultProps = defaultProps;

export default PriceBar;
