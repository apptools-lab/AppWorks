import React from 'react';
import Detail from '../../components/Detail';

const Ele1 = ({ text }) => <div>{text}</div>;
const name2 = 2;

const Tab = () => {
  const text1 = 1;
  const age1 = 10;
  const name = 'you';
  const name3 = 'me';
  const name4 = 4;
  const tabs = [1, 2, 3];
  const ele = <div>111</div>;
  const abc = 123;
  const d = 23;
  const o = {
    a: 1,
  };
  function handleClick() {
    console.log(d);
    console.log('handleClick');
  }

  return (
    <div key={name3}>
      <Detail age={text1} name={name} handleClick={handleClick}>
        {
          tabs.map((tab) => {
            return (
              <div>{tab}: {name3} {name4}</div>
            );
          })
        }
      </Detail>
      {ele}
      <Detail age={age1} name={name}>
        {ele}
      </Detail>
      {ele}
      <Detail age={age1} name={name3}>
        <span>{o.a}</span>
        <Ele1 text={name2} />
      </Detail>
      <div>{abc}</div>
    </div>
  );
};

export default Tab;

