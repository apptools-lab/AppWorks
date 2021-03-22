import React from 'react';
import TodoWithChildren from '../../components/TodoWithChildren';

const Ele1 = ({ text }) => <div>{text}</div>;
const name2 = 2;

const Tab = () => {
  const text1 = 1;
  const name3 = 3;
  const name4 = 4;
  const tabs = [1, 2, 3];
  const ele = <div>111</div>;
  const abc = 123;
  const d = 23;
  function handleClick() {
    console.log(d);
    console.log('handleClick');
  }

  return (
    <div key={name3}>
      <TodoWithChildren age={text1} handleClick={handleClick}>
        {
          tabs.map((tab) => {
            return (
              <div>{tab}: {name3} {name4}</div>
            );
          })
        }
      </TodoWithChildren>
      {ele}
      <TodoWithChildren age={name2}>
        {ele}
      </TodoWithChildren>
      {ele}
      <TodoWithChildren age={name2}>
        <span>111</span>
        <Ele1 text={name2} />
      </TodoWithChildren>
      <div>{abc}</div>
    </div>
  );
};

export default Tab;

