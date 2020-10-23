const { spawnSync, execSync } = require('child_process');
const path = require('path');
const fse = require('fs-extra');

console.log('=======tsc compile=======');
execSync('tsc', {stdio: 'inherit', encoding: 'utf-8'});

console.log('=======compile to kaitian extension=======');
execSync(`projectRoot=${path.join(__dirname, 'src')} node ./node_modules/.bin/kit-builder`, {stdio: 'inherit', encoding: 'utf-8', shell: true});

console.log('=======reorganize output files=======');
// move out kit-buider node entry
fse.moveSync(path.join(__dirname, './lib/node_modules/_@ali_kit-runner@0.0.2-alpha.4@@ali/kit-runner/src/node'), path.join(__dirname, './lib/node'), {overwrite: true});
fse.removeSync(path.join(__dirname, './lib/node_modules'));

// remove recompiled kit code
// TODO: support kit node webpack bundle
fse.removeSync(path.join(__dirname, './lib/src'));