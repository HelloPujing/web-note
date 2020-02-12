import React, { useCallback } from 'react';
import Main from './main';
import Panel from '../components/panel';
import './index.less';

const FindItems = React.memo(() => {
  const nav = useCallback(() => {}, []);
  return (
    <Panel title="找单品" onMore={nav}>
      <Main />
    </Panel>
  );
});

export default FindItems;
