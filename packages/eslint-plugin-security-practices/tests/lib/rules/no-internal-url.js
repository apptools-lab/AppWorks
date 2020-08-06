"use strict";

var rule = require("../../../lib/rules/no-internal-url");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-internal-url", rule, {

  valid: [{
    code: "var test = 'https://test.com';"
  }],

  invalid: [{
    code: "var test = 'https://test.com';",
    options: [['test.com']],
    errors: [{
      message: "The url 'https://test.com' is not recommended"
    }]
  },
  {
    code: "var test = 'https://test.alibaba-inc.com';",
    errors: [{
      message: "The url 'https://test.alibaba-inc.com' is not recommended"
    }]
  }]
});
