/* eslint-disable no-await-in-loop, no-restricted-syntax */
import * as glob from 'glob'
import * as path from 'path'
import * as fs from 'fs-extra'
import { run } from './fn/shell'

(async () => {
  await run('npx tsc --build ./tsconfig.json')

  // 在这之下的代码都是为了解决 tsc 不支持 copy 非 .ts/.tsx 文件的问题

  const fileParten = '*/src/**/!(*.ts|*.tsx)'
  console.log(`[COPY]: ${fileParten}`)

  const cwd = path.join(__dirname, '../packages')
  const files = glob.sync(fileParten, { cwd, nodir: true })
  for (const file of files) {
    const from = path.join(cwd, file)
    const to = path.join(cwd, file.replace(/\/src\//, '/lib/'))
    await fs.mkdirp(path.dirname(to))
    await fs.copyFile(from, to)
  }

})().catch((e) => {
  console.trace(e)
  process.exit(128)
});
