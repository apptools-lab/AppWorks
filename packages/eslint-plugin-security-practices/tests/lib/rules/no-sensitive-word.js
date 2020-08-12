"use strict";

var rule = require("../../../lib/rules/no-sensitive-word");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-sensitive-word", rule, {

  valid: [{
    code: "// nice"
  }],

  invalid: [{
    code: "// fuck",
    options: [['fuck']],
    errors: [{
      message: "Detect the sensitive word: 'fuck'"
    }]
  }]
});
