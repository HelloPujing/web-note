import React, { useState, useEffect } from 'react';
import { getPrivilegeConfig } from '@src/core/global';
import { defineModuleName } from '@src/core/point';
import Modal from '@src/widgets/modal';
import ChapterTitle from '../chapterTitle';
import ModalDetail from './modalDetail';
import Tr from './tr';
import './index.less';

const INIT_DATA = {
  board: 0,
  subject: 0,
  autoMatting: 0,
  recreate: 0
  // proDays
  // imgDLimitDailyCount: 0,
  // imgDLimitMonthlyCount: 0
  // pngDLimitDailyCount: 0,
  // pngDLimitMonthlyCount: 0
};

const genPrivileges = ({ board, recreate, autoMatting, subject }, showIntroduce) => ([
  { title: '查看1000+高佣金品牌', member: true, notMember: false },
  { title: '享受最低3.2折采购特权', member: true, notMember: false },
  { title: '画布编辑与模板功能', member: true, notMember: true },
  { title: '海量素材使用', member: '会员专用素材', notMember: '免费素材' },
  { title: '再创作功能', member: '无限', notMember: `${recreate}次/月` },
  { title: '拼图容量', member: '无限', notMember: `${board}张` },
  { title: '项目容量', member: '无限', notMember: `${subject}个` },
  { title: '自动抠图功能',
    titleFunc: () => showIntroduce('matting'),
    member: '无限',
    notMember: `${autoMatting}次/月`
  },
  { title: '拼图普清图片下载', member: true, notMember: true },
  { title: '拼图高清图片下载',
    titleFunc: () => showIntroduce('HD'),
    member: true,
    notMember: false
  },
  { title: '导出Excel清单',
    titleFunc: () => showIntroduce('Excel'),
    member: true,
    notMember: false
  },
  { title: '导出图文PDF',
    titleFunc: () => showIntroduce('PDF'),
    member: true,
    notMember: false
  },
  { title: '“我的单品”智能筛选',
    titleFunc: () => showIntroduce('filter'),
    member: true,
    notMember: false
  },
  { title: '佣金提现', member: true, notMember: false },
  { title: '单品透明底PNG原图下载', member: true, notMember: false },
  { title: '单品图片下载', member: '无水印、无限', notMember: '水印保护、限量限速' }

]);

/*
* 专业版权益介绍，老版新皮未重构
*  */
const PrivilegeList = React.memo(({ moduleName }) => {
  const [config, setConfig] = useState(INIT_DATA);

  useEffect(() => {
    const updateConfigData = () => {
      getPrivilegeConfig().then(res => {
        if (!res || typeof res !== 'object') return;

        const configKeys = Object.keys(res || {});

        // {key: {config: v}, ...} => {key: v, ... }
        const config = {};
        configKeys.forEach(v => { config[v] = res[v].config || ''; });

        setConfig(config);
      });
    };

    updateConfigData();
  }, []);


  const showIntroduce = type => {
    Modal.frame({
      content: (
        <ModalDetail
          type={type}
          moduleName={moduleName} // 暂未用到
        />
      ),
      closeable: true,
      footer: false
    });
  };

  const privileges = genPrivileges(config, showIntroduce);

  return (
    <div styleName="privilege">
      <ChapterTitle>美间会员特权</ChapterTitle>
      <div styleName="table">
        <div styleName="table-head">
          <span styleName="s-1">功能特权</span>
          <span styleName="s-2"><i />美间会员</span>
          <span styleName="s-3"><i />普通用户</span>
        </div>
        <div styleName="table-body">
          {
              privileges.map((data, i) => <Tr key={i} {...data} />)
            }
        </div>
      </div>
    </div>
  );
});

export default defineModuleName('ProIntro')(PrivilegeList);
