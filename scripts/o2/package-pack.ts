import { spawnSyncWithCatch } from '../fn/spawnSyncWithCatch';
import { PACK_DIR, PACKAGE_MANAGER } from './constant';

async function installPackDeps() {
  spawnSyncWithCatch(
    PACKAGE_MANAGER,
    ['install'],
    PACK_DIR,
  );
}

async function buildPack() {
  spawnSyncWithCatch(
    PACKAGE_MANAGER,
    ['install', '@ali/kaitian-cli', '-g'],
    process.cwd(),
  );
  spawnSyncWithCatch(
    'kaitian',
    ['package', '--yarn'],
    PACK_DIR,
  );
}

async function packagePack() {
  await installPackDeps();
  await buildPack();
}

packagePack().catch((e) => {
  console.error(e);
});
