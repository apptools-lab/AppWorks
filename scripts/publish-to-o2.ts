/**
 * O2 is a Ali internal editor,
 * This script is for compatible with O2 by modifying extensions at build time.
 */
import { spawnSync } from 'child_process';
import { readJson } from 'fs-extra';
import { join } from 'path';
import scanDirectory from './fn/scanDirectory';

const appendExtensionPackageJSON = {
  publishConfig: {
    access: 'public',
  },
  files: [
    'build',
  ],
};

const EXTENSION_NPM_NAME_PREFIX = '@iceworks/extension';

const EXTENSIONS_DIRECTORY = join(__dirname, '../extensions');

async function publishExtensionsToNpm() {
  const extensionFolders = await scanDirectory(EXTENSIONS_DIRECTORY);
  await Promise.all(
    extensionFolders.map(async (extensionFolderName) => {
      const extensionFolder = join(EXTENSIONS_DIRECTORY, extensionFolderName);
      const extensionPackageJSON = await readJson(join(extensionFolder, 'package.json'));
      extensionPackageJSON.name = `${EXTENSION_NPM_NAME_PREFIX}-${extensionPackageJSON.name}`;
      Object.assign(extensionPackageJSON, appendExtensionPackageJSON);
      spawnSync(
        'npm',
        ['publish'],
        {
          stdio: 'inherit',
          cwd: extensionFolder,
        },
      );
    }),
  );
}

publishExtensionsToNpm();
