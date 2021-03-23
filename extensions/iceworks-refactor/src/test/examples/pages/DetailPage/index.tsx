import React from 'react';
import Detail from '../../components/Detail';

const Ele1 = ({ text }) => <div>{text}</div>;
const Ele2 = () => (
  <Detail age={1} name="1">
    <span>{1}</span>
  </Detail>
);

const name2 = 2;

const Tab = () => {
  const text1 = 1;
  const age1 = 10;
  const name = 'you';
  const name3 = 'me';
  const name4 = 4;
  const tabs = [1, 2, 3];
  const ele = <div>111</div>;
  const r1 = 1;
  const r2 = 2;
  const r3 = 3;
  const abc = 1 + r3;
  const d = name4 + 1;
  const f = 100 * r1 + 10 * r2 + r3;
  const o = {
    b: {
      a: 1,
    },
  };
  class A {

  }
  function fn() {
    console.log(f);
    const a = new A();
    console.log(a);
  }
  function handleClick() {
    console.log(d);
    fn();
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
      {age1 === 10 ? (
        <Detail age={age1} name={name3}>
          <span>{o.b.a}</span>
          <Ele1 text={name2} />
        </Detail>
      ) : <div>hello world</div>}
      <Detail age={age1} name={name3}>
        <span>{o.b.a}</span>
        <Ele1 text={name2} />
      </Detail>
      <div>{abc}</div>
      {Ele2}
    </div>
  );
};

export default Tab;

