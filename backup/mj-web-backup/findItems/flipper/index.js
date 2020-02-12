import React from 'react';
import classnames from 'classnames';
import './index.less';

const Flipper = React.memo(({ className, disabled, onClick }) => {
  return (
    <div
      className={className}
      styleName={classnames('flipper', { disabled })}
      onClick={disabled ? null : onClick}
    />
  );
});

export default Flipper;
