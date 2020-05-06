import React, { PureComponent } from 'react';
import { defineModuleName } from '@src/core/point';
import UserProvider from '@src/components/context/userProvider';
import Layout from './layout';
import Banner from './banner';
import BasicInfo from './basicInfo';
import Main from './main';
import './index.less';


/*
* 专业版（VIP）购买页面
*
* */
@defineModuleName('VipPurchase')
export default class VipPurchasePop extends PureComponent {
  render() {
    return (
      <UserProvider>
        <Layout>
          <Banner />
          <div styleName="content">
            <BasicInfo />
            <Main />
          </div>
        </Layout>
      </UserProvider>
    );
  }
}
