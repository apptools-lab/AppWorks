"use strict";

var rule = require("../../../lib/rules/deps-recommend-update-rax");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("deps-recommend-update-rax", rule, {

  valid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ dependencies: { "rax": "^1.1.0", } })}`
  }],

  invalid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ dependencies: { "rax": "^0.6.0", } })}`,
    errors: [{
      message: 'Rax version < 1.0 , recommend to update Rax'
    }]
  }]
});
