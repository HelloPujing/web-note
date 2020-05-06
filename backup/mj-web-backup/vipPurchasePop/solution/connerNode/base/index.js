import React from 'react';
import classnames from 'classnames';

import Iconfont from '@src/components/iconfont';
import styles from './index.less';

const Base = React.memo(({ active, title, onclickInfo }) => {
  return (
    <>
      <div styleName={classnames('base-tag', { active })}>
        <span>{ title }</span>
        {
          onclickInfo && (
            <Iconfont
              id="note"
              size={12}
              className={styles['iconfont-help']}
              onClick={onclickInfo}
            />
          )
        }
      </div>
    </>
  );
});

export default Base;
