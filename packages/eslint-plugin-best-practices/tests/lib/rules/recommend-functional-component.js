var rule = require("../../../lib/rules/recommend-functional-component");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("recommend-functional-component", rule, {

  valid: [{
    code: `
      const App = () => {
        return (<p>hello world</p>);
      };
    `,
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    }
  }],

  invalid: [{
    code: `
      class App extends React.Component {
        render() {
          return (<p>hello world</p>);
        }
      }; 
    `,
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true
      }
    },
    errors: [{
      message: "It is not recommended to use class component 'App'"
    }]
  }]
});
