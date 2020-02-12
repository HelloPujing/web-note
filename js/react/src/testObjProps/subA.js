import React, {useContext} from 'react';

const SubA = React.memo(({ a }) => {
  console.log('---------------------subA');
  // console.log(obj);
  return (
    <div>
      subA - {a}
    </div>
  );
});

export default SubA;
