import React from 'react';
import './index.less';

const ChapterTitle = React.memo(({ children, className }) => {
  return (
    <div styleName="title" className={className}><span>{ children }</span></div>
  );
});

export default ChapterTitle;
