import React, { PureComponent } from 'react';
import networkService from 'Service/networkService';
import { defineUseModuleName } from '@src/core/point';
import setStateAsync from '@src/core/setStateAsync';
import { DISCOUNT_TYPE } from '@src/const/vip';
import { fmtNumber } from '@src/core/price/utils';
import { Embed as EmbedLoading } from '@meijian/loading';
import mapContextToProps from '@src/core/mapContextToProps';
import { userContext } from '@src/components/context/userProvider';
import Api from '@src/api';
import { PAY_CHANNEL } from './const';
import {
  getInitDiscountType,
  fmtSolution,
  fmtAvailableMoney, getAvailableChannels
} from './util';
import Solution from './solution';
import Total from './total';
import PayBar from './payBar';
import Footer from './footer';
import styles from './main.less';


/**
 * @desc 会员购买页面
 *
 */

const INIT_STATE = {
  // 服务端原始数据
  solutions/* 方案列表，服务端原始数据 */: [], // type, $isGroup, title, discounts{type, name, value}
  // 用户交互数据
  fetched           /* 主数据是否获取 - 会员方案、余额、动态下发 */: false,
  solutionIndex     /* 方案索引（当前选中的） */: 0,
  groupCount        /* 购买数量 - 普通数量固定1，团购数量2-30，如果多个团购要移到solutions下 */: 2,
  initDiscountType  /* 初始折扣类型，只给solution用，不随选择优惠而变更 */: 1,
  discountType      /* 折扣类型 - 1~3 会员续费2，非会员活动1 */: 1,
  balanceChecked    /* 是否使余额 */: false,
  availableMoney    /* 可提现金额 */: 0,
  payChannel        /* 支付渠道 - 需根据动态下发重新初始化 */: undefined,
  availableChannels /* 3种下发渠道是否可用 - [余额、支付宝、微信] */: [false, false, false]
};

@mapContextToProps(userContext, 'user')
@defineUseModuleName
@setStateAsync
export default class Main extends PureComponent {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;
  }

  componentDidMount() {
    this.initPrice();
  }

  /* 获取信息 */
  initPrice = () => {
    const { user: { isVip } = {} } = this.props;

    const taskURLs = [
      Api.pay.getChargeProducts, // 会员购买方案
      Api.finance.accountDetail, // 可提现余额
      Api.pay.getAvailableChannel // 支付渠道动态下发
    ];
    Promise
      .all(
        taskURLs.map(url => networkService.post({ url }))
      )
      .then((
        [
          _solutions,
          { availableMoney: _m } = {},
          _availableChannels = []
        ]
      ) => {
        const solutions = fmtSolution(_solutions, isVip);
        const i = solutions.findIndex(s => !s.$isGroup);
        const availableChannels = getAvailableChannels(_availableChannels);
        const [, enableAlipay, enableWechat] = availableChannels || [];
        const initDiscountType = getInitDiscountType(isVip, i > -1 ? solutions[i].discounts : []); // 个人版 默认优惠类型
        this.setState({
          // 重置所有信息
          // 避免支付错误后再次请求价格时，某些信息不对称
          // 譬如，团购出错，重置时，i变更，原discountType在新solution中不存在
          ...INIT_STATE,
          fetched: true,
          solutions,
          solutionIndex: i,
          initDiscountType,
          discountType: initDiscountType,
          availableMoney: fmtAvailableMoney(_m),
          payChannel: enableAlipay ? PAY_CHANNEL.ALI : (enableWechat ? PAY_CHANNEL.WECHAT : undefined),
          availableChannels
        });
      });
  }

  /* 选择购买方案 */
  onChangeSolution = (i, isGroup) => {
    const { user: { isVip } = {} } = this.props;
    const { solutions, solutionIndex } = this.state;

    if (solutionIndex === i) return;
    this.setState({
      solutionIndex: i,
      discountType: isGroup ? DISCOUNT_TYPE.GROUP : getInitDiscountType(isVip, solutions[i].discounts)
    });
  }

  /* 修改团购数量 */
  onChangeCount = newCount => {
    const { groupCount } = this.state;
    if (newCount === groupCount) return;

    this.setState({
      groupCount: newCount
    });
  }

  /* 选择折扣id */
  onChangeDiscount = id => {
    this.setState({
      discountType: id
    });
  }

  /* 勾选使用余额 */
  onCheckBalance = () => {
    this.setState(prevState => ({ balanceChecked: !prevState.balanceChecked }));
  }

  /* 选择支付渠道 */
  onChangePayChannel = channel => {
    const { payChannel } = this.state;
    if (payChannel === channel) return;

    this.setState({
      payChannel: channel
    });
  }

  render() {
    const { moduleName } = this.props;
    const {
      fetched, solutions, solutionIndex,
      groupCount, initDiscountType, discountType, balanceChecked, payChannel, availableChannels,
      availableMoney
    } = this.state;
    // 方案
    const solution = solutions[solutionIndex];
    const { $isGroup, amount, discounts } = solution || {};
    const count = $isGroup ? groupCount : 1;

    // 五大核心交互数据
    const coreData = { solution, count, discountType, balanceChecked, payChannel };

    // 折扣 0.88|0.5|1
    const discountObj = (discounts || []).find(({ type }) => type === discountType) || {};
    const { name: discountName = '', value: salePrice } = discountObj;

    // 四大核心价格
    const priceTotal/* 原价总价，整数元 */ = fmtNumber(amount * count, 'floor');
    const costTotal/* 实际总价，整数元 */ = fmtNumber(salePrice * count, 'floor');
    const canUseBalance/* 最多抵扣余额，浮点 */ = availableMoney > costTotal ? costTotal : availableMoney;
    const payTotal/* 第三方支付，浮点 */ = fmtNumber(costTotal - (balanceChecked ? canUseBalance : 0), 'round', 2);
    const corePrices = { priceTotal, costTotal, canUseBalance, payTotal };

    // 加载
    if (!fetched || !solutions.length) return <EmbedLoading show className={styles.loading} />;

    return (
      <>
        <div styleName="solutions-wrapper">
          {/* 购买方案 */}
          {
            solutions.map((solution, i) => {
              const { id, $isGroup } = solution || {};
              return (
                <Solution
                  key={id}
                  active={solutionIndex === i}
                  solution={solution}
                  initDiscountType={$isGroup ? DISCOUNT_TYPE.GROUP : initDiscountType}
                  groupCount={groupCount}
                  onChangeSolution={() => this.onChangeSolution(i, $isGroup)}
                  onChangeCount={this.onChangeCount}
                />
              );
            })
          }
        </div>
        {
          solution && (
            <>
              {/* 结算 */}
              <Total
                {...coreData}
                {...corePrices}
                discountName={discountName}
                availableMoney={availableMoney}
                availableChannels={availableChannels}
                onCheckBalance={this.onCheckBalance}
                onChangeDiscount={this.onChangeDiscount}
                onChangePayChannel={this.onChangePayChannel}
              />
              {/* 支付 */}
              <PayBar
                {...coreData}
                moduleName={moduleName}
                payTotal={corePrices.payTotal}
                initPrice={this.initPrice}
              />
              <Footer />
            </>
          )
        }
      </>
    );
  }
}
