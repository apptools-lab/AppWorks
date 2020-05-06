/* eslint-disable @typescript-eslint/no-var-requires */
import * as fse from 'fs-extra';
import init from '../command/init';
import add from '../command/add';

import path = require('path');
import rimraf = require('rimraf');
import mkdirp = require('mkdirp');

jest.setTimeout(30 * 1000);

test('init project', async () => {
  const projectDir = path.join(__dirname, 'tmp/init');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await init({
    type: 'project',
    npmName: '@alifd/fusion-design-pro',
    rootDir: projectDir,
  });

  expect(1).toBe(1);
});

test('add block to project', async () => {
  const projectDir = path.join(__dirname, 'tmp/add/ts');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await add({
    rootDir: projectDir,
    npmName: '@alifd/fusion-basic-list'
  });

  expect(1).toBe(1);
});

test('add block to project(transform ts)', async () => {
  const projectDir = path.join(__dirname, 'tmp/add/js');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);
  // mock js project
  fse.writeJSONSync(path.join(projectDir, 'package.json'), {});

  await add({
    rootDir: projectDir,
    npmName: '@alifd/fusion-basic-list'
  });

  expect(1).toBe(1);
});
