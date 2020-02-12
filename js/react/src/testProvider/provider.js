import React, { useState, useMemo } from 'react';

export const dataContext = React.createContext();
const { Provider } = dataContext;

const DataProvider = ({ children }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  console.log('provider:', a, b, c);
  return (
    <div style={{color: '#09d3ac'}}>
      <p onClick={() => setA(a+1)}>click to add a</p>
      <p onClick={() => setB(b+1)}>click to add b</p>
      <p onClick={() => setC(c+1)}>click to add c</p>
      <Provider value={a}>
        {children}
      </Provider>
    </div>
  );
};

export default DataProvider;
