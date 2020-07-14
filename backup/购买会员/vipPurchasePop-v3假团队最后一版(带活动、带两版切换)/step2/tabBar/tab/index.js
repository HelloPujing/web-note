import React from 'react';
import classnames from 'classnames';
import './index.less';

const Tab = React.memo(({ selected, isGroup, index, onChange }) => {
  return (
    <div
      styleName={classnames('vip-solution-tab', { selected }, { isGroup })}
      onClick={() => onChange(index)}
    >
      {isGroup ? '团队版' : '个人版' }
    </div>
  );
});

export default Tab;
