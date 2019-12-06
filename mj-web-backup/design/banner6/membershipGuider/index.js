import React from 'react';
import './index.less';

const MallGuider = React.memo(({ btnText = '', desc = '', onClick = () => {} }) => {
  return (
    <div styleName="membership-guider">
      <h1>高佣品牌、无限拼图、超清图片</h1>
      <h6>5分钟做完一个方案，50万软装设计师共同的选择</h6>
      <div styleName="guide-btn" onClick={onClick}>{btnText}</div>
      <p>{desc}</p>
    </div>
  );
});

export default MallGuider;
