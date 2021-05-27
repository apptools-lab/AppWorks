import { execSync } from 'child_process';
import { PACK_DIR, PACKAGE_MANAGER } from './constant';

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
  await installPackDeps();
  await buildPack();
}

packagePack().catch((e) => {
  console.error(e);
});
