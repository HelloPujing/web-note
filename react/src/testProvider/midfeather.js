import React from 'react';

const MidFeather = React.memo(({ children }) => {
  console.log('---------------------mid');
  return (
    <div style={{ color: '#fff' }}>
      { children }
    </div>
  );
});

export default MidFeather;
