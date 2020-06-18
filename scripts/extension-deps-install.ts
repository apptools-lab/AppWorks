import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

(async function () {
  const extensionsPath = path.join(__dirname, '../extensions')
  const extensionFiles = await fse.readdir(extensionsPath);
  for (let i = 0; i < extensionFiles.length; i++) {
    const cwd = path.join(extensionsPath, extensionFiles[i]);
    console.log('Installing extension\'s dependencies', cwd);
    spawn.sync('npm', ['install', '--registry', 'http://registry.npm.taobao.org'], {
      stdio: 'inherit',
      cwd,
    });
    const webviewPath = path.join(cwd, 'web');
    if (fse.existsSync(webviewPath)) {
      // webview: npm install
      console.log('Installing extension webview\'s dependencies', webviewPath);
      spawn.sync('npm', [
        'install', '--registry', 'http://registry.npm.taobao.org'
      ], {
        stdio: 'inherit',
        cwd: webviewPath,
      });
    }
  }
})().catch(e => {
  console.trace(e);
  process.exit(128);
})
