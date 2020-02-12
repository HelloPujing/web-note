import React from 'react';
import PropTypes from 'prop-types';
import PubSub from '@/service/pubSub';
import './edit.less';

/**
 * @desc 编辑按钮
 *
 */

const propTypes = {
  moduleName: PropTypes.string.isRequired,
  itemInfo: PropTypes.instanceOf(Object).isRequired,
  // from redux
  openModal: PropTypes.func
};

const defaultProps = {
  openModal: () => {}
};

const EditBtn = React.memo(props => {
  const {
    moduleName, itemInfo, openModal
  } = props;
  function editItem() {
    openModal({
      isOpen: true,
      type: 'editItemInfo',
      builtInProps: {
        moduleName,
        itemInfo,
        footer: {
          confirm: (e, closeModal) => {
            closeModal();
          }
        }
      }
    });
    PubSub.publish('editItem', { moduleName });
  }

  return (
    <div styleName="edit-btn" onClick={editItem}>编辑</div>
  );
});

EditBtn.propTypes = propTypes;
EditBtn.defaultProps = defaultProps;

export default EditBtn;
