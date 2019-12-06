import React, {useContext} from 'react';

const SubC = React.memo(({}) => {
  console.log('---------------------subC');
  return (<div> subC </div>)
});

export default SubC;
