import React, { useCallback } from 'react';
import Iconfont from '@src/components/iconfont';
import Modal from '@src/widgets/modal';
import ModalGroupPayInfo from './modalGroupPayInfo';
import styles from './index.less';

const HelpIcon = React.memo(() => {
  const popGroupInfo = useCallback(e => {
    e.stopPropagation();
    Modal.frame({
      content: <ModalGroupPayInfo />,
      footer: false,
      closeable: true
    });
  }, []);

  return (
    <Iconfont
      id="note"
      size={12}
      className={styles['iconfont-help']}
      onClick={popGroupInfo}
    />
  );
});

export default HelpIcon;
