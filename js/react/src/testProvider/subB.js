import React, {useContext} from 'react';
import {dataContext} from './provider';

const SubB = React.memo(({}) => {
  console.log('---------------------subB');
});

export default SubB;
