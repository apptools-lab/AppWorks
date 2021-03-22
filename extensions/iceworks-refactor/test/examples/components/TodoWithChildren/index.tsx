import React from 'react';

interface IProps {
  age: number;
  children: any;
  handleClick?: any;
}

const TodoChildren = ({ age, handleClick, children }: IProps) => {
  return (
    <div onClick={handleClick}>
      {age}
      {children}
    </div>
  );
};

export default TodoChildren;
