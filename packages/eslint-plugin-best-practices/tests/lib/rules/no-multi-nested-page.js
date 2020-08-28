"use strict";

var rule = require("../../../lib/rules/no-multi-nested-page");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-multi-nested-page", rule, {

  valid: [{
    filename:"fileA",
    code: `
      const App = () => {
        return (<iframe src="https://taobao.com" />);
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
    filename:"fileB",
    code: `
    const App = () => {
      return (
        <div>
          <iframe src="https://taobao.com" />
          <iframe src="https://tmall.com" />
        </div>
      );
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
      message: "Multiple nested pages are not recommended"
    }]
  }]
});
