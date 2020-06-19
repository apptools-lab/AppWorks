import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';
import { run } from './fn/shell';

(async function () {
  const extensionsPath = path.join(__dirname, '../extensions')
  const extensionFiles = await fse.readdir(extensionsPath);
  const packagesPath = path.join(__dirname, '../packages');;
  const packageFiles = await fse.readdir(packagesPath);

  return await Promise.all(extensionFiles.map(async extensionFile => {
    const cwd = path.join(extensionsPath, extensionFile);
    if (fse.existsSync(cwd)) {
      // link packages to extension
      if (process.env.TRAVIS) {
        await runNpmLink(cwd, packageFiles, path.join(cwd, '../../', 'packages'));
      } else {
        await removeIceworks(cwd);
      }
      const webviewPath = path.join(cwd, 'web');
      if (fse.existsSync(webviewPath)) {
        // link packages to extension webview
        if (process.env.TRAVIS) {
          await runNpmLink(webviewPath, packageFiles, path.join(webviewPath, '../../../', 'packages'));
        } else {
          await removeIceworks(webviewPath);
        }
      }
    }
  }))
})().catch(e => {
  console.trace(e);
  process.exit(128);
})

async function removeIceworks(cwd: string) {
  const cwdStat = await fse.stat(cwd);
  if (cwdStat.isDirectory()) {
    await run(`rm -rf ${path.join(cwd, 'node_modules', '@iceworks')}`);
  }
}

async function runNpmLink(cwd: string, packageFiles: string[], linkPath: string) {
  const cwdStat = await fse.stat(cwd);
  if (cwdStat.isDirectory()) {
    const packageJSON: any = await fse.readJson(path.join(cwd, 'package.json'));
    if (packageJSON.dependencies) {
      const packageNames = Reflect.ownKeys(packageJSON.dependencies).filter((moduleName: string) => {
        return /^@iceworks/.test(moduleName);
      });
      if (packageNames.length) {
        packageNames.forEach((packageName: string) => {
          packageName = packageName.replace('@iceworks/', '');
          if (packageFiles.includes(packageName)) {
            console.log('\n extension', cwd, 'link package:', packageName, '\n');
            spawn.sync('npm', ['link', path.join(linkPath, packageName)], {
              stdio: 'inherit',
              cwd,
            });
          }
        })
      }
    }
  }
}
