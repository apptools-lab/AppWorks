"use strict";

var rule = require("../../../lib/rules/no-secret-info");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester();

ruleTester.run("no-secret-info", rule, {
  valid: [{
    code: "var accessKeySecret = process.env.ACCESS_KEY_SECRET;"
  },{
    code: `
    var client ={
      accessKeyToken: process.env.ACCESS_KEY_SECRET
    };
    `
  }],

  invalid: [{
    code: "var accessKeySecret = 'xxxx';",
    errors: [{
      message: "Detect that the 'xxxx' might be a secret token, Please check!"
    }]
  }, {
    code: `
    var client ={
      accessKeyToken: 'xxxx'
    };
    `,
    errors: [{
      message: "Detect that the 'xxxx' might be a secret token, Please check!"
    }]
  }]
});
