import React, {useContext} from 'react';
import {dataContext} from './provider';

const SubA = React.memo(({}) => {
  console.log('---------------------subA');
  const a = useContext(dataContext);
  // console.log(obj);
  return (
    <div>
      subA - {a}
    </div>
  );
});

export default SubA;
