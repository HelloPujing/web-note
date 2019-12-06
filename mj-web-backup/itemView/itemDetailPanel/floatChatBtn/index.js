import React from 'react';
import PropTypes from 'prop-types';
import './floatChatBtn.less';

const propTypes = {
  chatToBuyItem: PropTypes.func.isRequired
};

const FloatChatBtn = React.memo(props => {
  const { chatToBuyItem } = props;
  return (
    <div
      styleName="float-chat-btn"
      onClick={chatToBuyItem}
    >
      <i styleName="chat-icon" />
      <span>咨询</span>
    </div>
  );
});

FloatChatBtn.propTypes = propTypes;

export default FloatChatBtn;
