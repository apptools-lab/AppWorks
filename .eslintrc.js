const { eslint, tslint, deepmerge } = require('@ice/spec');

const commonRules = {
  'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx', '.tsx'] }],
  'react/jsx-no-target-blank': [0],
  'prefer-object-spread': 0,
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
