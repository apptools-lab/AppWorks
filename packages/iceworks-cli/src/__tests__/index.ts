import * as fse from 'fs-extra';
import init from '../command/init';
import add from '../command/add';
import generate from '../command/generate';

import path = require('path');
import rimraf = require('rimraf');
import mkdirp = require('mkdirp');

jest.setTimeout(30 * 1000);

test('init project', async () => {
  const projectDir = path.join(__dirname, 'tmp/init/project');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await init({
    type: 'project',
    npmName: '@alifd/fusion-design-pro',
    rootDir: projectDir,
  });

  expect(1).toBe(1);
});

test('init material', async () => {
  const projectDir = path.join(__dirname, 'tmp/init/material');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await init({
    type: 'material',
    npmName: '@icedesign/ice-react-material-template',
    rootDir: projectDir,
  });

  const blockPkgPath = path.join(projectDir, 'blocks/ExampleBlock/package.json');
  const blockPkgData = fse.readJSONSync(blockPkgPath);
  // published
  blockPkgData.version = '1.0.8';
  fse.writeJSONSync(blockPkgPath, blockPkgData);

  // iceworks generate
  await generate({
    rootDir: projectDir,
  });

  // iceworks add component
  await add({
    materialType: 'component',
    type: 'material',
    rootDir: projectDir,
  });

  try {
    // iceworks generate
    await generate({
      rootDir: projectDir,
    });
  } catch(err) {
    console.error('generate error', err);
    expect(err.message).toMatch('未发布');
  }

  expect(1).toBe(1);
});

test('init component', async () => {
  const projectDir = path.join(__dirname, 'tmp/init/component');
  rimraf.sync(projectDir);
  mkdirp.sync(projectDir);

  await init({
    type: 'component',
    npmName: '@icedesign/ice-react-ts-material-template',
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
