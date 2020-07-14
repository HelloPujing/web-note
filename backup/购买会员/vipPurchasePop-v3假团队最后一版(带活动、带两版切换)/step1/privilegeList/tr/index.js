import React from 'react';
import classnames from 'classnames';
import Iconfont from '@src/components/iconfont';
import styles from './index.less';

/**
 * {string|boolean} value - (非)会员文本/icon
 */
const Td = React.memo(({ vipColumn, value }) => {
  if (typeof value === 'string') return <p>{ value }</p>;

  // boolean
  return (
    <Iconfont
      className={styles[vipColumn ? 'iconfont_right' : 'iconfont_wrong']}
      id={value ? 'right' : 'wrong'}
      size={12}
    />
  );
});

/**
 * @desc 行
 *
 */
const Tr = React.memo(({ title, titleFunc, member, notMember }) => (
  <div styleName="prof-li">
    <div styleName={classnames('l', 'l-1')}>
      <p>
        { title }
        {
          typeof titleFunc === 'function' && (
            <i
              styleName="link"
              onClick={titleFunc}
            />
          )
        }
      </p>
    </div>
    <div styleName={classnames('l', 'l-2')}><Td vipColumn value={member} /></div>
    <div styleName={classnames('l', 'l-3')}><Td vipColumn={false} value={notMember} /></div>
  </div>
));

export default Tr;
