import React, {useContext} from 'react';

const SubB = React.memo(({}) => {
  console.log('---------------------subB');
  return (<div> subB </div>)
});

export default SubB;
