import React, { useCallback } from 'react';
import Modal from '@src/widgets/modal';
import ModalGroupPayInfo from './modalGroupPayInfo';
import Base from './base';

const ConnerNode = React.memo(({ active, title, isGroup }) => {
  const popGroupInfo = useCallback(e => {
    e.stopPropagation();
    Modal.frame({
      content: <ModalGroupPayInfo />,
      footer: false,
      closeable: true
    });
  }, []);

  return (

    <Base
      active={active}
      title={title}
      onclickInfo={isGroup ? popGroupInfo : null}
    />
  );
});

export default ConnerNode;
