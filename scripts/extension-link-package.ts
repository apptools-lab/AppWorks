import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

(async function () {
  const extensionsPath = path.join(__dirname, '../extensions')
  const extensionFiles = await fse.readdir(extensionsPath);
  const packagesPath = path.join(__dirname, '../packages');;
  const packageFiles = await fse.readdir(packagesPath);

  return await Promise.all(extensionFiles.map(async extensionFile => {
    const cwd = path.join(extensionsPath, extensionFile);
    const cwdStat = await fse.stat(cwd);
    if (cwdStat.isDirectory()) {
      const packageJSON: any = await fse.readJson(path.join(cwd, 'package.json'));
      if (packageJSON.dependencies) {
        const packageNames = Reflect.ownKeys(packageJSON.dependencies).filter((moduleName: string) => {
          return /^@iceworks/.test(moduleName);
        });
        // link packages to extension
        if (packageNames.length) {
          packageNames.forEach((packageName: string) => {
            packageName = packageName.replace('@iceworks/', '');
            if (packageFiles.includes(packageName)) {
              console.log('extension:', extensionFile, 'link package: ', packageName);
              spawn.sync('npm', ['link', path.join(cwd, '../../', 'packages', packageName)], {
                stdio: 'inherit',
                cwd,
              });
            }
          })
        }
      }

      const webviewPath = path.join(cwd, 'web');
      const webviewStat = await fse.stat(webviewPath);
      if (fse.existsSync(webviewPath) && webviewStat.isDirectory()) {
        const packageJSON: any = await fse.readJson(path.join(webviewPath, 'package.json'));
        const packageNames = Reflect.ownKeys(packageJSON.dependencies).filter((moduleName: string) => {
          return /^@iceworks/.test(moduleName);
        });
        // link packages to extension webview
        if (packageNames.length) {
          packageNames.forEach((packageName: string) => {
            packageName = packageName.replace('@iceworks/', '');
            if (packageFiles.includes(packageName)) {
              console.log('extension web:', extensionFile, 'link package:', packageName);
              spawn.sync('npm', ['link', path.join(webviewPath, '../../../', 'packages', packageName)], {
                stdio: 'inherit',
                cwd: webviewPath,
              });
            }
          })
        }
      }
    }
  }))
})().catch(e => {
  console.trace(e);
  process.exit(128);
})