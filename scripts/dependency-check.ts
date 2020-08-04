import * as execa from 'execa';
import * as chalk from 'chalk';
import getPackages from './fn/getPackages';

(async () => {
  const { packageDirs } = await getPackages();
  packageDirs.forEach((pkgDir) => {
    execa.commandSync(`dependency-check ${pkgDir} --missing -i vscode -i puppeteer -i @babel/runtime`, {
      cwd: pkgDir,
      stdio: 'inherit',
    });
  });
})().catch((e) => {
  console.log(chalk.red('\n ⚠️  ⚠️  ⚠️  依赖检查失败\n\n'), e);
  process.exit(128);
});
