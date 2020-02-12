import React from 'react';
import './index.less';

const MallGuider = React.memo(({ desc, onClick }) => {
  return (
    <div styleName="mall-guider">
      <h1>设计+采购 一站完成</h1>
      <p onClick={onClick}>{desc}<i /></p>
    </div>
  );
});

export default MallGuider;
