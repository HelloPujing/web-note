import React from 'react';
import './index.less';

const ConnerNode = React.memo(({ title, className }) => {
  return (
    <div styleName="conner-tag" className={className}>
      <span>{ title }</span>
    </div>
  );
});

export default ConnerNode;
