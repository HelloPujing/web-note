import React, {useState} from 'react';
import SubA from "./subA";
import SubB from "./subB";
import SubC from "./subC";

const obj = {};

const TestProvider = ({  }) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  console.log('state:', a, b, c);

  return (
    <div style={{color: '#09d3ac'}}>
      <p onClick={() => setA(a+1)}>click to add a</p>
      <p onClick={() => setB(b+1)}>click to add b</p>
      <p onClick={() => setC(c+1)}>click to add c</p>
      <div style={{ color: '#fff' }}>
        <SubA a={a}/>
        <SubB />
        <SubC />
      </div>
    </div>
  );
};

export default TestProvider;

/**
 * 结论：props如果是obj
 * 如果obj不变，只obj的某个属性变，则不会引起重渲染
 *
 */
