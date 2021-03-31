import React from 'react';

const Ele2 = () => {};

const Tab = () => {
  const age1 = 10;

  const name3 = 'me';

  const ele = <div>111</div>;

  const r3 = 3;
  const abc = 1 + r3;

  return (
    <div key={name3}>
      {ele}

      {ele}
      {age1 === 10 ? null : <div>hello world</div>}

      <div>{abc}</div>
      {Ele2}
    </div>
  );
};

export default Tab;
