import React from 'react';
import PropTypes from 'prop-types';
import './edit.less';

/**
 * @desc 编辑按钮
 *
 */

const propTypes = {
  toggleItemEditorModal: PropTypes.func
};

const defaultProps = {
  toggleItemEditorModal: () => {}
};

const EditBtn = React.memo(props => {
  const { toggleItemEditorModal } = props;

  return (
    <div styleName="edit-btn" onClick={toggleItemEditorModal}>编辑</div>
  );
});

EditBtn.propTypes = propTypes;
EditBtn.defaultProps = defaultProps;

export default EditBtn;
