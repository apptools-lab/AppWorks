const { tslint, deepmerge } = require('@ice/spec');

module.exports = deepmerge(tslint, {
  env: {
    jest: true
  },
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", '.tsx'] }]
  },
});
