const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  rules: {
    'react/jsx-filename-extension': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
});
