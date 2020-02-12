import React from 'react';
import { connect } from 'react-redux';
import LinkToService from '@src/services/route/linkToService';
import { checkLogin } from '@src/core/userUtils';
import { defineModuleName } from '@src/core/point';
import { settingPayPop } from '@/redux/action/common/payPop';
import { settingGlobalModal } from '@/redux/action/common/modal';
import { MEMBER_LEVEL } from '@/service/constService';
import networkService from '@/service/networkService';
import Api from '@/api/index';
import MembershipGuider from './membershipGuider';
import MallGuider from './mallGuider';
import './banner.less';

/**
 * @desc 设计专区Banner资源位
 * ----------------引导成为会员----------------
 * 未使用专业版(包括游客)<LEVEL_COMMON>：【试用专业版】限时折扣：xx元起
 * 试用版中未购买<LEVEL_TRIAL>：        【升级为专业版】您的专业版试用还剩余：30天
 * 试用版结束未购买<TRIAL_INVALID>:     【升级为专业版】限时折扣：xx元起
 * 专业版即将到期：                     【立即续费】您好，亲爱的专业版用户，您的专业版时间剩余：30天
 * 专业版已到期：                       【立即续费】您好，亲爱的专业版用户，您的专业版时间已到期。限时折扣：XX元起。
 * <LEVEL_PAYED(<=30d) || PAYED_INVALID>
 * -----------------引导商城----------------
 * 专业版充足<LEVEL_PAYED(>30d)>：      马上了解最新采购优惠->
 *
 *
 *   问题：
 *   用户信息userInfo只进应用&重新登录的时候拉取数据，含有memberLevel(专业版状态)、memberTime(专业版过期时间)
 *   userPrivilege每次进页面都拉取数据，含proDays-Config(后台专业版天数)、proDaysUsed(专业版过期时间，和userInfo中一致)
 *   综合考虑:
 *   专业版天数，取userPrivilege-proDays-Config // 时效性强一些
 *   专业版过期时间，取userPrivilege-proDaysUsed // 时效性强一些
 *   专业版状态，取userInfo-memberTime // 时效性变化不大
 *
 */
// TODO 跟进会员体系项目PRD更改,当次不动
const PAGE_TEMPLATE/* 页面展示类型构造器 */ = {
  /* ------------------------引导会员---------------------------- */
  NO_TRIAL/* 未使用专业版(包括游客)<LEVEL_COMMON> */: ({ proPrice, openUpgradePanel }) => ({
    component: MembershipGuider,
    btnText: '试用专业版',
    desc: `限时折扣：${proPrice}元起`,
    onClick: openUpgradePanel
  }),
  TRIAL_ING/* 试用版中未购买<LEVEL_TRIAL> */: ({ lastDays, openUpgradePanel }) => ({
    component: MembershipGuider,
    btnText: '升级为专业版',
    desc: `您的专业版试用还剩余：${lastDays}天`,
    onClick: openUpgradePanel
  }),
  TRIAL_INVALID/* 试用版结束未购买<TRIAL_INVALID> */: ({ proPrice, openUpgradePanel }) => ({
    component: MembershipGuider,
    btnText: '升级为专业版',
    desc: `限时折扣：${proPrice}元起`,
    onClick: openUpgradePanel
  }),
  PAYED_EXPIRING/* 专业版即将到期：<LEVEL_PAYED(<=30d)> */: ({ lastDays, openUpgradePanel, openPayPop }) => ({
    component: MembershipGuider,
    btnText: '立即续费',
    desc: `您好，亲爱的专业版用户，您的专业版时间剩余：${lastDays}天`,
    onClick: lastDays === 0 ? openUpgradePanel : openPayPop
  }),
  PAYED_EXPIRED/* 专业版已到期：<PAYED_INVALID> */: ({ proPrice, openPayPop }) => ({
    component: MembershipGuider,
    btnText: '立即续费',
    desc: `您好，亲爱的用户，您的专业版时间已到期。限时折扣：${proPrice}元起。`,
    onClick: openPayPop
  }),
  /* ------------------------引导商城---------------------------- */
  PAYED_FRESH/* 专业版充足<LEVEL_PAYED(>30d)> */: ({ openArticle }) => ({
    component: MallGuider,
    desc: '马上了解最新采购优惠',
    onClick: openArticle
  })
};

/**
 * @desc 页面生成器
 *
 */
const genPageInfo = ({ isLogin, memberLevel, proDayConfig, lastDays, proPrice, openUpgradePanel, openPayPop, openArticle }) => {
  let generator = () => ({});
  if (!isLogin) {
    generator = PAGE_TEMPLATE.NO_TRIAL;
  } else {
    switch (memberLevel) {
      case MEMBER_LEVEL.LEVEL_COMMON:
        generator = PAGE_TEMPLATE.NO_TRIAL;
        break;
      case MEMBER_LEVEL.LEVEL_TRIAL:
        generator = PAGE_TEMPLATE.TRIAL_ING;
        break;
      case MEMBER_LEVEL.TRIAL_INVALID:
        generator = PAGE_TEMPLATE.TRIAL_INVALID;
        break;
      case MEMBER_LEVEL.LEVEL_PAYED:
        generator = (!lastDays || lastDays <= proDayConfig) ? PAGE_TEMPLATE.PAYED_EXPIRING : PAGE_TEMPLATE.PAYED_FRESH;
        break;
      case MEMBER_LEVEL.PAYED_INVALID:
        generator = PAGE_TEMPLATE.PAYED_EXPIRED;
        break;
      default:
        break;
    }
  }

  return generator({ lastDays, proPrice, openUpgradePanel, openPayPop, openArticle });
};

@defineModuleName('DesignBanner')
@connect(
  ({ userModel }) => ({
    isLogin: userModel.isLogin,
    userInfo: userModel.userInfo
  }),
  dispatch => ({
    openModal: payload => {
      dispatch(settingGlobalModal({ ...payload, isOpen: true }));
    },
    openPayPop: () => {
      dispatch(settingPayPop({
        isOpen: true
      }));
    }
  })
)
class Banner extends React.PureComponent {
  state = {
    proPrice/* 专业版价格 */: 0,
    proDayConfig/* 专业版配置天数 */: 0,
    proDayExpired/* 专业版过期日 */: 0
  }

  componentDidMount() {
    this.initProPrice();
    this.initProDays();
  }

  // 获取专业版价格，取各种方案的最小值
  initProPrice = () => {
    networkService.post({
      url: Api.pay.getChargeProducts
    })
      .then(res => {
        const proProducts = res || [];
        const payAmounts = proProducts.map(proProduct => proProduct && proProduct.payAmount);
        this.setState({
          proPrice: Math.min(...payAmounts) || 0
        });
      });
  }

  // 获取专业版日期等信息
  initProDays = () => {
    networkService.get({ url: Api.commonData.getPrivilege })
      .then(({ proDays }) => {
        const { config, used } = proDays || {};
        this.setState({
          proDayConfig: config,
          proDayExpired: used
        });
      });
  }

  /* 获取页面信息 */
  openUpgradePanel = () => {
    if (!checkLogin()) return;

    const { openModal, userInfo = {} } = this.props;
    openModal({
      type: 'activation',
      builtInProps: {
        memberLevel: userInfo.memberLevel
      }
    });
  };

  /* 打开咨询文章 */
  openArticle = () => {
    const articleId = NEWEST_PURCHASE_ARTICLE_ID;
    LinkToService.article({
      id: articleId
    });
  };

  render() {
    const { isLogin, userInfo: { memberLevel } = {}, openPayPop } = this.props;
    const { proPrice, proDayConfig, proDayExpired } = this.state;
    const nowTime = +new Date();
    const lastDays = proDayExpired - nowTime > 0 ? Math.ceil((proDayExpired - nowTime) / (60 * 60 * 24 * 1000)) : 0;
    const pageType = genPageInfo({
      isLogin,
      memberLevel,
      proDayConfig,
      lastDays,
      proPrice,
      openPayPop,
      openUpgradePanel: this.openUpgradePanel,
      openArticle: this.openArticle
    }) || {};
    const { component = MembershipGuider, ...pageProps } = pageType;

    return (
      <div
        styleName="banner"
        data-theme={component === MembershipGuider ? 'scene' : 'pure'}
      >
        <div styleName="banner-container">
          <div styleName="banner-content-wrapper">
            {React.createElement(component, { ...pageProps })}
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
