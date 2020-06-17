import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

(async function () {
  const extensionsPath = path.join(__dirname, '../extensions')
  const extensionFiles = await fse.readdir(extensionsPath);
  for (let i = 0; i < extensionFiles.length; i++) {
    const cwd = path.join(extensionsPath, extensionFiles[i]);
    console.log(cwd);
    spawn.sync('npm', ['install'], {
      stdio: 'inherit',
      cwd,
    });
  }
})().catch(e => {
  console.trace(e);
  process.exit(128);
})