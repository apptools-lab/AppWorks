const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  env: {
    jest: true
  },
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", '.tsx'] }],
    "@typescript-eslint/ban-ts-ignore": 0,
    "react/jsx-no-target-blank": [0],
  },
});
