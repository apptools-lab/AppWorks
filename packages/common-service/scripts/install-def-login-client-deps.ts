import * as path from 'path';
import * as spawn from 'cross-spawn';

/**
 * install package def-login-client dependencies
 */
+ function () {
  const cwd = path.join(__dirname, '..', 'def-login-client');
  const installCommonds = ['install'];
  console.log('Start to install def-login-client dependencies...');
  spawn.sync('npm', installCommonds, {
    stdio: 'inherit',
    cwd
  });
}()