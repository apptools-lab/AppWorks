const { prettier, deepmerge } = require('@ice/spec');

module.exports = deepmerge(prettier, {
  printWidth: 120,
});
