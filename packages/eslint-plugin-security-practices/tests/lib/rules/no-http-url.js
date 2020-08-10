"use strict";

var rule = require("../../../lib/rules/no-http-url");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-http-url", rule, {

  valid: [{
    code: "var test = 'https://test.com';"
  }],

  invalid: [{
    code: "var test = 'http://test.com';",
    output: "var test = 'https://test.com';",
    errors: [{
      message: "Recommended 'http://test.com' switch to HTTPS"
    }]
  }, {
    code: "<img src='http://test.com' />",
    output: "<img src='https://test.com' />",
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    errors: [{
      message: "Recommended 'http://test.com' switch to HTTPS"
    }]
  }]
});
