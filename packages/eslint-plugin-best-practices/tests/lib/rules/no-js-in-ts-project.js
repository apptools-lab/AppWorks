"use strict";

var rule = require("../../../lib/rules/no-js-in-ts-project");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-js-in-ts-project", rule, {

  valid: [{
      filename: 'index.ts',
      code: ""
    },
    {
      filename: 'home.ts',
      code: ""
    }
  ],

  invalid: [{
    filename: 'home.js',
    code: "",
    errors: [{
      message: "The 'home.js' is not recommended in TS project"
    }]

  }]
});
