import * as path from 'path';
import * as fse from 'fs-extra';
import * as camelCase from 'camelcase';
import * as pkgDir from 'pkg-dir';
import * as glob from 'glob';
import * as transformTsToJs from 'transform-ts-to-js';

import extractTarball from '../../utils/extractTarball';
import log from '../../utils/log';
import { TEMP_PATH } from '../../utils/constants';
import getNpmTarball from '../../utils/getNpmTarball';
import getNpmRegistry from '../../utils/getNpmRegistry';

// @ts-ignore
import readFiles = require('fs-readdir-recursive');

export default async (options, destDir) => {
  const tempDir = TEMP_PATH;

  await fse.ensureDir(tempDir);
  try {
    const blockDirPath = await addBlock(options, destDir, tempDir);
    await fse.remove(tempDir);
    log.info('add block success, you can import and use block in your page code', blockDirPath);
  } catch (err) {
    fse.removeSync(tempDir);
    throw err;
  }
};

async function addBlock(options, destDir, tempDir) {
  // eslint-disable-next-line prefer-const
  let { npmName, name: blockDirName } = options;
  log.verbose('addBlockToProject', options);

  // download npm block
  if (!blockDirName) {
    // @icedesign/example-block | example-block
    const name = npmName.split('/')[1] || npmName.split('/')[0];
    blockDirName = camelCase(name, { pascalCase: true });
  }
  const blockDirPath = path.resolve(destDir, blockDirName);

  return fse
    .pathExists(blockDirPath)
    .then((exists) => {
      if (exists) {
        return Promise.reject(
          new Error(`${blockDirPath} already exists, you can use cli -n option to custom block directory name`),
        );
      }
      return Promise.resolve();
    })
    .then(() => {
      return getNpmRegistry(npmName, null, null, true);
    })
    .then((registry) => {
      return getNpmTarball(npmName, 'latest', registry);
    })
    .then((tarballURL) => {
      return extractTarball({
        tarballURL,
        destDir: tempDir,
      });
    })
    .then(() => {
      log.info('AddBlock', 'create block directory……');
      return fse.mkdirp(blockDirPath);
    })
    .then(() => {
      log.info('AddBlock', 'copy block src files to dest blockDir');

      const blockType = getBlockType(tempDir);
      const projectType = getProjectType(blockDirPath);
      const blockSourceSrcPath = path.join(tempDir, 'src');

      log.verbose('blockType: ', blockType, 'projectType: ', projectType);

      if (blockType === 'ts' && projectType === 'js') {
        // transform ts to js
        const files = glob.sync('**/*.@(ts|tsx)', {
          cwd: blockSourceSrcPath,
        });
        log.verbose('transform ts to js', files.join(','));
        transformTsToJs(files, {
          cwd: blockSourceSrcPath,
          outDir: blockSourceSrcPath,
          action: 'overwrite',
        });
      }
      return fse.copy(blockSourceSrcPath, blockDirPath, {
        overwrite: false,
        errorOnExist: true,
      });
    })
    .then(() => {
      return blockDirPath;
    });
}

function getBlockType(blockDirPath) {
  const files = readFiles(path.join(blockDirPath, 'src'));

  const index = files.findIndex((item) => {
    return /\.ts(x)/.test(item);
  });

  return index >= 0 ? 'ts' : 'js';
}

function getProjectType(destDir) {
  const projectDir = pkgDir.sync(destDir);

  log.verbose('projectDir: ', projectDir);

  const hasTsconfig = fse.existsSync(path.join(projectDir, 'tsconfig.json'));
  const hasAppJs =
    fse.existsSync(path.join(projectDir, 'src/app.js')) || fse.existsSync(path.join(projectDir, 'src/app.jsx'));

  // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
  return hasTsconfig && !hasAppJs ? 'ts' : 'js';
}
