import React, { useCallback, useEffect, useState } from 'react';
import throttle from 'lodash/throttle';
import Message from '@meijian/message';
import networkService from 'Service/networkService';
import Api from '@src/api';
import { defineModuleName } from '@src/core/point';
import UserProvider, { userContext } from '@src/components/context/userProvider';
import mapContextToProps from '@src/core/mapContextToProps';
import { fmtSolution } from '@src/pages/vipPurchasePop/utils/data';
import { detectBrowserZoom } from '@src/utils/platform/browser';
import { inWindows } from '@src/utils/platform/system';
import { getItem, removeItem } from 'Service/webStorageService';
import { getActivityRemainTime } from './activityUtil';
import VipPopContext from './context/vipPopContext';
import PageFrame from './layout/pageFrame';
import ContentFrame from './layout/contentFrame';
import HeadBar from './headBar';
import Banner from './step1/banner';
import ActivityBg from './step1/activity/activityBg';
import FeaturedPrivilege from './step1/activity/featuredPrivilege';
import Solutions from './step1/solutions';
import PrivilegeList from './step1/privilegeList';
import BasicInfo from './step2/basicInfo';
import TabBar from './step2/tabBar';
import Main from './step2/main';
import Footer from './step2/footer';
import Step3 from './step3';

const MODULE_NAME = 'VipPurchase';

/*
* 专业版（VIP）购买页面
*
* */
const VipPurchasePop = React.memo(({ user }) => {
  const [step, setStep]/* 流程 */ = useState(1);
  const [loading, setLoading]/* 方案loading */ = useState(false);
  const [solutions, setSolutions]/* 方案列表 */ = useState([]);
  const [solutionIndex, setSolutionIndex]/* 索引 */ = useState(0);
  // count, payAmount，useBalance
  const [successInfo, setSuccessInfo]/* 成功信息，给step3用 */ = useState({});
  const [activity, setActivity]/* 活动 {remainTime} */ = useState(null);

  const { isVip } = user || {};

  // 购买方案列表
  // 活动: { remainTime } ；未获取数据时null, 获取数据但活动结束remainTime=0
  useEffect(() => {
    if (step === 1) {
      setLoading(true);
      networkService.post({ url: Api.pay.getChargeProducts, catchError: true, getResponseHeader: ['date', 'RESPONSE_HEADER_DATE'] })
        .then(r => {
          // 洗数据
          // 必须在初始阶段就处理，不然非会员会看到续费低价
          setSolutions(fmtSolution(r, isVip));
          setLoading(false);
          // 会员活动
          const serverDate = getItem('RESPONSE_HEADER_DATE');
          const remainTime = getActivityRemainTime(serverDate);
          setActivity({ remainTime });
          // setActivity({ remainTime: 25 * 1000 });
        })
        .catch(({ m }) => {
          Message.error(m);
          setLoading(false);
          setActivity({ remainTime: 0 });
        });
    }
    return () => {
      removeItem('RESPONSE_HEADER_DATE');
    };
  }, [isVip, step]);

  // step1 -> step2
  const toStep2 = useCallback(solutionIndex => {
    setStep(2);
    setSolutionIndex(solutionIndex);
  }, []);

  // step2 -> step1
  const toStep1 = useCallback(() => { setStep(1); }, []);

  const toStep3 = useCallback(newInfo => {
    networkService.post({ // 触发更新会员时间
      url: Api.member.memberInfo
      // headers: { 'mj-get-member-info': true }
    })
      .then(({ memberTime } = {}) => {
        setSuccessInfo({ ...successInfo, ...newInfo, memberTime });
        setStep(3);
      });
  }, [successInfo]);

  // 当前方案
  const solution =
    solutions && solutions.length && solutionIndex > -1
      ? solutions[solutionIndex]
      : {};

  // 浏览器缩放
  const [zoomed, setZoomed]/* 浏览器缩放比 */ = useState(false);
  // const zoomPercent = fmtNumber(zoomRatio * 100, 'round', 0);
  useEffect(() => {
    const onResize = throttle(() => {
      const [zoomed] = detectBrowserZoom();
      setZoomed(zoomed);
    }, 500, { leading: true });
    if (inWindows) {
      onResize();
      window.addEventListener('resize', onResize);
    }
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const solutionsProps = { isVip, loading, solutions, toStep2 };
  return (
    <UserProvider>
      <VipPopContext.Provider value={{ setSolutionIndex }}>
        <PageFrame step={step} solutions={solutions} duringActivity={activity && activity.remainTime > 0}>
          {
          step === 1 && (
            <>
              {
                activity && activity.remainTime <= 0 && (
                  <>
                    <Banner />
                    <Solutions {...solutionsProps} />
                  </>
                )
              }
              {
                activity && activity.remainTime > 0 && (
                  <>
                    <ActivityBg activity={activity} setActivity={setActivity} />
                    <Solutions {...solutionsProps} duringActivity />
                    <FeaturedPrivilege />
                  </>
                )
              }
              <PrivilegeList />
            </>
          )
        }
          {
          step === 2 && (
            <>
              <HeadBar goBack={toStep1} />
              <ContentFrame>
                <BasicInfo />
                <TabBar
                  solutions={solutions}
                  solutionIndex={solutionIndex}
                />
                <Main
                  solution={solution}
                  isVip={isVip}
                  toStep3={toStep3}
                />
                <Footer>
                  { zoomed && inWindows && <p>如支付码显示不全，请按住ctrl+鼠标滚轮进行调整</p>}
                </Footer>
              </ContentFrame>
            </>
          )
        }
          {
          step === 3 && (
            <>
              <HeadBar />
              <ContentFrame>
                <Step3
                  isGroup={solution && solution.$isGroup}
                  successInfo={successInfo}
                />
              </ContentFrame>
            </>
          )
        }
        </PageFrame>
      </VipPopContext.Provider>
    </UserProvider>
  );
});

const _export =
  defineModuleName(MODULE_NAME)(
    mapContextToProps(userContext, 'user')(
      VipPurchasePop
    )
  );

export default _export;
