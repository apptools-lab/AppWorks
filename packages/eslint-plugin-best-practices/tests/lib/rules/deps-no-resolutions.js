var rule = require("../../../lib/rules/deps-no-resolutions");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();
ruleTester.run("deps-no-resolutions", rule, {

  valid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ name: 'test' })}`
  }],

  invalid: [{
    filename: 'package.json',
    code: `module.exports = ${JSON.stringify({ resolutions: { 'ice.js': '1.0.0' } })}`,
    errors: [{
      message: 'It is not recommended to use resolutions to lock the version'
    }]
  }]
});
