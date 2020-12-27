import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';
import { OSS_PACKAGES } from './constant';

const nodeModulesPath = path.join(__dirname, '..', '..', 'node_modules');

(function () {
  OSS_PACKAGES.forEach(async (packageName) => {
    try {
      const cwd = path.join(nodeModulesPath, packageName);
      const pathExists = await fse.pathExists(cwd);
      if (!pathExists) {
        return;
      }
      const installCommonds = ['install', '--production'];
      console.log(`Start to install ${packageName} dependencies`);
      spawn.sync('npm', installCommonds, {
        stdio: 'inherit',
        cwd,
      });
    } catch (e) {
      console.log(e);
    }
  });
})();
