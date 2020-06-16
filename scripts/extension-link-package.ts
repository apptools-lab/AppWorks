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
      if (packageJSON.devDependencies) {
        const packageNames = Reflect.ownKeys(packageJSON.dependencies).filter((moduleName: string) => {
          return /^@iceworks/.test(moduleName);
        });

        if (packageNames.length) {
          packageNames.forEach((packageName: string) => {
            packageName = packageName.replace('@iceworks/', '');
            if (packageFiles.includes(packageName)) {
              console.log('extension', extensionFile, 'link package:', packageName);
              spawn.sync('npm', ['link', path.join(cwd, '../../', 'packages', packageName)], {
                stdio: 'inherit',
                cwd,
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