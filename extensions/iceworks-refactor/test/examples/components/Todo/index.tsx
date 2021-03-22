import React from 'react';

const Todo = ({ text, name }) => {
  return (
    <div>Todo: {text} {name}</div>
  );
};

export default Todo;

const Todo2 = ({ age, name }) => {
  return (
    <div>Todo: {age} - {name}</div>
  );
};

export { Todo2 };
