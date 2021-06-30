/* eslint-disable */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { minify } = require('terser');
const { execSync } = require('child_process');

function unlinkSync(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // ignore error
  }
}

// Remove devDependencies
try {
  execSync('npm prune --production', { stdio: 'inherit' });
} catch (e) {
  // ignore error
}

// ESLint has its own loader specification and cannot use webpack to build the entire package.
// Keep the npm package in node_modules so that ESLint can find the corresponding configs and plugins.
//
// When VS Code is released with all files in node_modules, the package size will exceed 30MB.
// This script filters all files in node_modules to remove unnecessary files and reduce the package size.
//
// After running this script, you may not be able to debug this project. You can reinstall the dependency for debugging.
glob(`${path.join(__dirname, '../node_modules')}/**/*.+(${['js', 'ts', 'md', 'map'].join('|')})`, { nodir: true }, async (error, files) => {
  if (!error) {
    console.log(`Start minify node_modules js files, count: ${files.length}`);

    for (let i = 0, l = files.length; i < l; i++) {
      const file = files[i];

      // Delete .md, .ts and .map file after build
      if (/\.(md|ts|map)$/.test(file)) {
        unlinkSync(file);
        continue;
      }

      // Delete */test/*  file after build
      if (/^(?:\/(.*))\/test(?:\/(.*))[\/#\?]?$/i.test(file)) {
        unlinkSync(file);
        continue;
      }

      // Minify node_modules js files
      let minifiedCode = '';
      try {
        const result = await minify({
          [file]: fs.readFileSync(file, 'utf8'),
        });
        minifiedCode = result.code;
      } catch (e) {
        // ignore
      }

      if (minifiedCode) {
        fs.writeFileSync(file, minifiedCode, 'utf8');
      }
    }
  }
});


// Delete licenses
glob(`${path.join(__dirname, '../node_modules')}/**/license`, { nodir: true }, async (error, files) => {
  if (!error) {
    (files || []).forEach(file => {
      unlinkSync(file);
    });
  }
});
