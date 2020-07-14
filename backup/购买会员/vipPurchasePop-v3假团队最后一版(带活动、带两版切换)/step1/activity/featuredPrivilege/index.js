import React from 'react';
import ChapterTitle from '@src/pages/vipPurchasePop/step1/chapterTitle';
import './index.less';

const Block = ({ title, desc }) => {
  return (
    <div styleName="privilege-block">
      <h6>{title}</h6>
      <p>{desc}</p>
      <div styleName="img" />
    </div>
  );
};

const privileges = [
  { title: '设计方案再创作', desc: '无限次' },
  { title: '图片智能处理', desc: '自动抠、透明底、超高清' },
  { title: '全网单品返佣', desc: '最高市场3倍' },
  { title: '方案采购清单', desc: '自动关联、一键导出' }
];

const FeaturedPrivilege = React.memo(() => {
  return (
    <div styleName="member-activity-privilege">
      <ChapterTitle>会员精选特权</ChapterTitle>
      <div styleName="blocks-wrapper">
        {
          privileges.map((v, i) => (<Block {...v} key={i} />))
        }
      </div>
    </div>
  );
});

export default FeaturedPrivilege;
