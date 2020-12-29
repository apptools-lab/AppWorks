import { spawnSync } from 'child_process';
import { PACK_DIR, PACKAGE_MANAGER } from './constant';

async function installPackDeps() {
  spawnSync(
    PACKAGE_MANAGER,
    ['install'],
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function buildPack() {
  spawnSync(
    PACKAGE_MANAGER,
    ['install', '@ali/kaitian-cli', '-g'],
    { stdio: 'inherit', cwd: process.cwd() },
  );
  spawnSync(
    'kaitian',
    ['package', '--yarn'],
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function packagePack() {
  await installPackDeps();
  await buildPack();
}

packagePack().catch((e) => {
  console.error(e);
});
