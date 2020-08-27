"use strict";

var rule = require("../../../lib/rules/deps-no-router-library");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("deps-no-router-library", rule, {

  valid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ devDependencies: { "ice.js": "^1.0.0", } })}`
  }],

  invalid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ devDependencies: { "react-router": "^5.2.0", } })}`,
    errors: [{
      message: 'It is not recommended to directly rely on routing libraries "react-router"'
    }]
  }]
});
