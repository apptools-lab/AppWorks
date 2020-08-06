import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

export default function () {
  const extensionsPath = path.join(__dirname, '..', '..', 'extensions');
  const extensionFiles = fse.readdirSync(extensionsPath);
  const installCommonds = ['install'];
  if (!process.env.CI) {
    installCommonds.push('--no-package-lock');
    installCommonds.push('--registry');
    installCommonds.push(process.env.REGISTRY ? process.env.REGISTRY : 'http://registry.npm.taobao.org');
  }

  for (let i = 0; i < extensionFiles.length; i++) {
    const cwd = path.join(extensionsPath, extensionFiles[i]);
    // eslint-disable-next-line quotes
    console.log("Installing extension's dependencies", cwd);

    spawn.sync('npm', installCommonds, {
      stdio: 'inherit',
      cwd,
    });
    const webviewPath = path.join(cwd, 'web');
    if (fse.existsSync(webviewPath)) {
      // eslint-disable-next-line quotes
      console.log("Installing extension webview's dependencies", webviewPath);
      spawn.sync('npm', installCommonds, {
        stdio: 'inherit',
        cwd: webviewPath,
      });
    }
  }
}
