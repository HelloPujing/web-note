import React, { useCallback } from 'react';
import classnames from 'classnames';
import Iconfont from '@src/components/iconfont';
import styles from './index.less';

const NumberInput = React.memo(({
  active,
  min, max, groupCount,
  onSubtract, onAdd,
  onKeyPress, onChange, onBlur
}) => {
  const disabledSubtract = groupCount <= min;
  const disabledAdd = groupCount >= max;
  const getClassName = useCallback(disabledType => classnames(
    styles.btn,
    { [styles.active]: active },
    { [styles.disabled]: disabledType }
  ), [active]);
  return (
    <div styleName="group-count">
      <Iconfont
        id="subtract"
        size={16}
        className={getClassName(disabledSubtract)}
        onClick={disabledSubtract ? null : onSubtract}
      />
      <input
        type="text"
        value={groupCount}
        onKeyPress={onKeyPress}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Iconfont
        id="add"
        size={16}
        className={getClassName(disabledAdd)}
        onClick={disabledAdd ? null : onAdd}
      />
    </div>
  );
});

export default NumberInput;
