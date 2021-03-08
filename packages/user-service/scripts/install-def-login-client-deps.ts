import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

/**
 * install package def-login-client dependencies
 */
(async function () {
  try {
    const cwd = path.join(__dirname, '..', 'def-login-client');
    const pathExists = await fse.pathExists(cwd);
    if (!pathExists) {
      return;
    }
    const installCommonds = ['install'];
    console.log('Start to install def-login-client dependencies...');
    spawn.sync('npm', installCommonds, {
      stdio: 'inherit',
      cwd,
    });
  } catch (e) {
    console.log(e);
  }
})();
