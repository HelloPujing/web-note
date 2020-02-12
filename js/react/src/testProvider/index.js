import React from 'react';
import MidFeather from "./midfeather";
import DataProvider from './provider';
import SubA from "./subA";
import SubB from "./subB";

const TestProvider = ({  }) => {
  return (
    <div >
      <DataProvider>
        <MidFeather >
          <SubA />
          <SubB />
        </MidFeather>
      </DataProvider>
    </div>
  );
};

export default TestProvider;
