import React from 'react';

const COLOR = {
  green: '#09d3ac',
  white: '#fff'
};

const ColorPanel = ({ color, children }) => {

  return (
    <div style={{color: COLOR[color]}}>
      {children}
    </div>
  );
};

export default ColorPanel;
