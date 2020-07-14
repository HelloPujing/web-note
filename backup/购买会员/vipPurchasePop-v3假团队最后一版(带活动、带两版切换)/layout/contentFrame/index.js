import React from 'react';
import './index.less';

const ContentFrame = ({ children }) => {
  return (
    <div styleName="content-frame">
      {children}
    </div>
  );
};

export default ContentFrame;
