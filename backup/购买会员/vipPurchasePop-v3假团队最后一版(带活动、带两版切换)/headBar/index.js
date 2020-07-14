import React from 'react';
import Iconfont from '@src/components/iconfont';
import styles from './index.less';

const HeadBar = ({ goBack }) => {
  return (
    <div styleName="head-bar">
      {
        goBack && (
          <>
            <Iconfont
              className={styles['step2-back']}
              id="arrow-left"
              size={20}
              onClick={goBack}
            />
          </>
        )
      }
      <span>购买会员</span>
    </div>
  );
};

export default HeadBar;
