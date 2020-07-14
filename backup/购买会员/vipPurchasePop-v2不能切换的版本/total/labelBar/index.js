import React from 'react';
import './index.less';

const LabelBar = React.memo(({ label, children }) => {
  return (
    <div styleName="label-bar">
      <div styleName="label">{label}</div>
      <div styleName="content">{children}</div>
    </div>
  );
});

export default LabelBar;
