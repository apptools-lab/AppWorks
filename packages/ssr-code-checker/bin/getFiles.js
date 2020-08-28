const fs = require('fs-extra');
const { glob } = require('glob');

// Ignore directories
const IGNORE_DIRS = ['build', 'es', 'dist', 'lib', 'node_modules', 'public', 'test', '__tests__'];
// Support file exts
const EXTS = ['js', 'jsx', 'ts', 'tsx', 'css', 'less', 'sass', 'scss'];

// https://www.npmjs.com/package/glob
module.exports = function (directory) {
  const options = {
    nodir: true,
    ignore: IGNORE_DIRS.map((ignoreDir) => `${directory}/**/${ignoreDir}/**`),
  };

  return glob.sync(`${directory}/**/*.+(${EXTS.join('|')})`, options).map((filePath) => {
    let source = fs.readFileSync(filePath).toString().trim();

    // if begins with shebang
    if (source[0] === '#' && source[1] === '!') {
      source = `//${source}`;
    }

    return {
      path: filePath,
      source,
    };
  });
};
