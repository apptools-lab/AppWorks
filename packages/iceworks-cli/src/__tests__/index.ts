/* eslint-disable @typescript-eslint/no-var-requires */
import init from '../command/init';

import path = require('path');
import rimraf = require('rimraf');
import mkdirp = require('mkdirp');

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

  expect(1).toBe(1);
});
