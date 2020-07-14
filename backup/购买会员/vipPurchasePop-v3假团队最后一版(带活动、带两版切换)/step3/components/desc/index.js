import React from 'react';
import './index.less';

const Desc = React.memo(({ k, v }) => {
  return (
    <div styleName="pay-success-desc">
      <h6>{k}</h6>
      <span>{v}</span>
    </div>
  );
});

export default Desc;
