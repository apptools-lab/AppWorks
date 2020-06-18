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
      await runNpmLink(cwd, packageFiles);
      const webviewPath = path.join(cwd, 'web');
      if (fse.existsSync(webviewPath)) {
        // link packages to extension webview
        await runNpmLink(webviewPath, packageFiles);
      }
    }
  }))
})().catch(e => {
  console.trace(e);
  process.exit(128);
})

async function runNpmLink(cwd: string, packageFiles: string[]) {
  const cwdStat = await fse.stat(cwd);
  if (cwdStat.isDirectory()) {
    const packageJSON: any = await fse.readJson(path.join(cwd, 'package.json'));
    if (packageJSON.dependencies) {
      const packageNames = Reflect.ownKeys(packageJSON.dependencies).filter((moduleName: string) => {
        return /^@iceworks/.test(moduleName);
      });
      if (packageNames.length) {
        packageNames.map(async (packageName: string) => {
          const packageOrginName = packageName.replace('@iceworks/', '');
          if (packageFiles.includes(packageOrginName)) {
            console.log('\n extension', cwd, 'link package:', packageOrginName, '\n');
            await run(`cd ${cwd} && rm -rf node_modules/${packageName}`);
          }
        })
      }
    }
  }
}
