import React from 'react';

interface IProps {
  age: number;
  name: string;
  children: any;
  handleClick?: any;
}

const TodoChildren = ({ age, name, handleClick, children }: IProps) => {
  return (
    <div onClick={handleClick}>
      age: {age}, name: {name}
      {children}
    </div>
  );
};

export default TodoChildren;
