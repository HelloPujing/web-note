import React from 'react';
import classnames from 'classnames';
import { Embed as EmbedLoading } from '@meijian/loading';
import Solution from '../solution';
import ActivitySolution from '../solution/activitySolution';
import styles from './index.less';

const Solutions = React.memo(({ isVip, loading, solutions, toStep2, duringActivity = false }) => {
  if (loading && (!solutions || !solutions.length)) { // 刷新的话就不显示了(避免闪烁)
    return <EmbedLoading show className={styles.loading} />;
  }

  return (
    <div styleName={classnames('solutions', { activity1: duringActivity })}>
      {/* 非会员 方案标题 */}
      { !duringActivity && <h1>加入美间会员</h1> }
      <div styleName="solutions-wrapper">
        {
          solutions.map((solution, i) => {
            const { id } = solution || {};
            const props = {
              key: id,
              isVip,
              solution,
              onClick: () => toStep2(i)
            };

            return React.createElement(duringActivity ? ActivitySolution : Solution, props);
          })
        }
      </div>
    </div>
  );
});

export default Solutions;
