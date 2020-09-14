/* eslint-disable no-await-in-loop, no-restricted-syntax */
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';
import { run } from './fn/shell';

(async () => {
  // 对 packages 进行 TypeScript 构建
  await run('npx tsc --build ./tsconfig.json');
  await run('lerna run build');

  const packagesPath = path.join(__dirname, '../packages');
  const packageFiles = await fs.readdir(packagesPath);
  return await Promise.all(
    packageFiles.map(async (packageFile) => {
      const cwd = path.join(packagesPath, packageFile);
      const cwdStat = await fs.stat(cwd);
      if (cwdStat.isDirectory()) {
        const packageJSON: any = await fs.readJson(path.join(cwd, 'package.json'));
        const isUIPackage = packageJSON && packageJSON.devDependencies && packageJSON.devDependencies['@alifd/next'];

        // 解决 tsc 不支持 copy 非 .ts/.tsx 文件的问题
        if (!isUIPackage) {
          console.log('copy cwd', cwd);
          const filePattern = 'src/**/!(*.ts|*.tsx)';
          const files = glob.sync(filePattern, { cwd, nodir: true });
          console.log('copy files', files);

          return await Promise.all(
            files.map(async (file) => {
              const from = path.join(cwd, file);
              const to = path.join(cwd, file.replace(/src\//, 'lib/'));
              console.log('copy from', from);
              console.log('copy to', to);

              await fs.mkdirp(path.dirname(to));
              await fs.copyFile(from, to);
            }),
          );
        }
      }
    }),
  );
})().catch((e) => {
  console.trace(e);
  process.exit(128);
});
