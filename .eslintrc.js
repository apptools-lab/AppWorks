const { getESLintConfig } = require('@iceworks/spec');

// getESLintConfig(rule: 'rax'|'react'|'vue', customConfig?);
module.exports = getESLintConfig('react-ts', {
  rules: {
    "@typescript-eslint/member-delimiter-style": 1,
    "max-len": 1,
    "import/no-cycle": 1,
    "@typescript-eslint/dot-notation": 1,
    "@typescript-eslint/consistent-type-assertions": 1,
    "@typescript-eslint/brace-style": 1,
    "no-redeclare": 1,
  },
});