/* eslint-disable @typescript-eslint/no-var-requires */
require('jest-extended');
const path = require('path');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const init = require('../command/init');
// const add = require('../command/add');
// const config = require('../command/config');
// const generate = require('../command/generate');
// const start = require('../command/start');
// const sync = require('../command/sync');

jest.setTimeout(10 * 1000);

test('iceworks-cli', async () => {
  const projectDir = path.join(__dirname, 'tmp');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await init({
    type: 'project',
    npmName: '@alifd/fusion-design-pro',
    rootDir: projectDir,
  });

  // expect(1).toBe(1);
});
