const { getESLintConfig } = require('@iceworks/spec');

// getESLintConfig(rule: 'rax'|'react'|'vue', customConfig?);
module.exports = getESLintConfig('react-ts', {
  parserOptions: {
    project: [],
    createDefaultProgram: false,
  },
  rules: {
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/restrict-plus-operands': 0,
    '@typescript-eslint/member-delimiter-style': 1,
    'max-len': 1,
    'import/no-cycle': 1,
    '@typescript-eslint/consistent-type-assertions': 1,
    '@typescript-eslint/brace-style': 1,
    'no-redeclare': 1,
  },
});
