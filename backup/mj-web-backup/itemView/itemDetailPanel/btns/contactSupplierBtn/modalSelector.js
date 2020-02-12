import React from 'react';
import Select from '@/components/widgets/select';
import styles from './modalSelector.less';

const propTypes = {

};

const defaultProps = {

};

const ModalSelector = React.memo(() => {
  return (
    <div styleName="modal-selector">
      <h1>请选择供应商所在城市</h1>
      <Select
        value={1}
        list={[{ name: '北京市', id: 1 }]}
        size="middle"
        className={styles['city-selector']}
        onChange={() => {}}
      />
    </div>
  );
});

ModalSelector.propTypes = propTypes;
ModalSelector.defaultProps = defaultProps;

export default ModalSelector;
