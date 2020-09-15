/* eslint @typescript-eslint/explicit-function-return-type:0 */
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import { run } from './fn/shell';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nsfw = require('nsfw');

async function watchFiles(cwd, ext) {
  const files = glob.sync(ext, { cwd, nodir: true });

  const fileSet = new Set();
  /* eslint no-restricted-syntax:0 */
  for (const file of files) {
    /* eslint no-await-in-loop:0 */
    await copyOneFile(file, cwd);
    fileSet.add(path.join(cwd, file));
  }

  const watcher = await nsfw(cwd, (event) => {
    event.forEach((e) => {
      if (
        e.action === nsfw.actions.CREATED ||
        e.action === nsfw.actions.MODIFIED ||
        e.action === nsfw.actions.RENAMED
      ) {
        const filePath = e.newFile ? path.join(e.directory, e.newFile!) : path.join(e.directory, e.file!);
        if (fileSet.has(filePath)) {
          console.log('non-ts change detected:', filePath);
          copyOneFile(path.relative(cwd, filePath), cwd);
        }
      }
    });
  });
  watcher.start();
}

watchFiles(path.join(__dirname, '../packages'), '*/src/**/!(*.ts|*.tsx)').catch((e) => {
  console.trace(e);
  process.exit(128);
});

// 在这之上的代码都是为了解决 tsc 不支持 copy 非 .ts/.tsx 文件的问题
async function tscWatcher() {
  await run('npx tsc --build ./tsconfig.json -w');
}

tscWatcher();

async function copyOneFile(file, cwd) {
  const from = path.join(cwd, file);
  const to = path.join(cwd, file.replace(/src\//, '/lib/'));
  await fs.copy(from, to);
}
