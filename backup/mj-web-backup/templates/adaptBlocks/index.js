import React, { useCallback } from 'react';
import Panel from '../components/panel';
import Card from './card';
import './index.less';

function Articles() {
  const nav = useCallback(() => {}, []);
  return (
    <Panel title="行业资讯" onMore={nav}>
      <div styleName="container">
        {
          [1, 2, 3, 4].map((v, i) => (
            <Card key={i} />
          ))
        }
      </div>
    </Panel>
  );
}

export default React.memo(Articles);
