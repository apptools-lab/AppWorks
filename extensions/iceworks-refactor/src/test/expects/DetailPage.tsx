import React from 'react';

const Tab = () => {
  const name3 = 'me';
  const ele = <div>111</div>;
  const abc = 123;
  return (
    <div key={name3}>

      {ele}

      {ele}

      <div>{abc}</div>
    </div>
  );
};

export default Tab;
