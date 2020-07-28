const { prettier, deepmerge } = require('@ice/spec');

module.exports = deepmerge(prettier, {
  "tabWidth": 2,
  "useTabs": false,
  "jsxSingleQuote": true,
  "printWidth": 120,
});
