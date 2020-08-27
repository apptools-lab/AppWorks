# recommend-functional-component

It is not recommended to use class component.

## Rule Details

Examples of **incorrect** code for this rule:

```js
class App extends React.Component {
  render() {
    return (<p>hello world</p>);
  }
}; 
```

Examples of **correct** code for this rule:

```js
 const App = () => {
  return (<p>hello world</p>);
};
```