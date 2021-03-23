const Todo = ({ text, name, onClick }) => {
  return (
    <div onClick={onClick}>Todo: {text} {name}</div>
  );
};

export default Todo;

const Todo2 = ({ age, name }) => {
  return (
    <div>Todo: {age} - {name}</div>
  );
};

export { Todo2 };
