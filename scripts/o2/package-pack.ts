import { execSync } from 'child_process';
import { PACK_DIR, PACKAGE_MANAGER, INNER_EXTENSIONS_DIRECTORY } from './constant';
import * as fse from 'fs-extra';
import { join } from 'path';

async function installPackDeps() {
  execSync(
    `${PACKAGE_MANAGER} install`,
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function buildPack() {
  execSync(
    `${PACKAGE_MANAGER} install @ali/kaitian-cli -g`,
    { stdio: 'inherit', cwd: process.cwd() },
  );
  execSync(
    'kaitian package --yarn',
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function packagePack() {
  // if some static files are not found when packaging the o2, copy it to the extensions/appworks dir
  await fse.copy(join(INNER_EXTENSIONS_DIRECTORY, 'material-helper', 'snippets'), join(PACK_DIR, 'snippets'));
  await installPackDeps();
  await buildPack();
}

packagePack().catch((e) => {
  console.error(e);
});
