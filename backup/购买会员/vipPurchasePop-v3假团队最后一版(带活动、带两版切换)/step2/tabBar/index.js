import React from 'react';
import VipPopContext from '@src/pages/vipPurchasePop/context/vipPopContext';
import Tab from './tab';
import './index.less';

const TabBar = React.memo(({ solutions, solutionIndex }) => {
  const { setSolutionIndex } = React.useContext(VipPopContext);

  return (
    <div styleName="vip-solution-tab-bar">
      {
        (solutions || []).map(({ $isGroup } = {}, i) => (
          <Tab
            key={`solution-tab-${i}`}
            index={i}
            selected={i === solutionIndex}
            isGroup={$isGroup}
            onChange={setSolutionIndex}
          />
        ))
      }
    </div>
  );
});

export default TabBar;
