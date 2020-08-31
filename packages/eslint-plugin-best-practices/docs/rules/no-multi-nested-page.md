# no-multi-nested-page

Multiple nested pages are not recommended.

## Rule Details

Examples of **incorrect** code for this rule:

```js
const App = () => {
  return (
    <div>
      <iframe src="https://taobao.com" />
      <iframe src="https://tmall.com" />
    </div>
  );
};
```

Examples of **correct** code for this rule:

```js
const App = () => {
  return (
    <div>
      <iframe src="https://taobao.com" />
    </div>
  );
};
```
