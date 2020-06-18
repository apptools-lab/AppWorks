import * as path from 'path';
import * as fse from 'fs-extra';
import { run } from './fn/shell';

(async function () {
  const extensionsPath = path.join(__dirname, '../extensions')
  const extensionFiles = await fse.readdir(extensionsPath);

  return await Promise.all(extensionFiles.map(async extensionFile => {
    const cwd = path.join(extensionsPath, extensionFile);
    if (fse.existsSync(cwd)) {
      // link packages to extension
      await runNpmLink(cwd);
      const webviewPath = path.join(cwd, 'web');
      if (fse.existsSync(webviewPath)) {
        // link packages to extension webview
        await runNpmLink(webviewPath);
      }
    }
  }))
})().catch(e => {
  console.trace(e);
  process.exit(128);
})

async function runNpmLink(cwd: string) {
  const cwdStat = await fse.stat(cwd);
  if (cwdStat.isDirectory()) {
    await run(`rm -rf ${path.join(cwd, 'node_modules', '@iceworks')}`);
  }
}
