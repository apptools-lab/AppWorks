const { eslint, tslint, deepmerge } = require('@ice/spec');

const commonRules = {
  'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.tsx'] }],
  'react/jsx-no-target-blank': [0],
  'prefer-object-spread': 0,
  '@typescript-eslint/array-type': 0,
  '@typescript-eslint/no-non-null-assertion': 0,
  'max-classes-per-file': 0,
  'class-methods-use-this': 0
};

const jsRules = deepmerge(eslint, {
  env: {
    jest: true
  },
  rules: {
    ...commonRules,
  },
});

const tsRules = deepmerge(tslint, {
  env: {
    jest: true
  },
  rules: {
    ...commonRules,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/array-type': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-parameter-properties': 0
  },
});

delete tsRules.root;

module.exports = {
  ...jsRules,
  overrides: [
    {
      ...tsRules,
      files: ['**/*.ts', '**/*.tsx'],
    },
  ],
};
