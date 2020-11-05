import { spawnSync } from 'child_process';
import { PACK_DIR } from './constant';

async function installPackDeps() {
  spawnSync(
    'tnpm',
    ['install'],
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function packagePack() {
  spawnSync(
    'tnpm',
    ['install', '@ali/kaitian-cli', '-g'],
    { stdio: 'inherit', cwd: process.cwd() },
  );
  spawnSync(
    'kaitian',
    ['package', '--yarn'],
    { stdio: 'inherit', cwd: PACK_DIR },
  );
}

async function buildPack() {
  await installPackDeps();
  await packagePack();
}

buildPack().catch((e) => {
  console.error(e);
});
