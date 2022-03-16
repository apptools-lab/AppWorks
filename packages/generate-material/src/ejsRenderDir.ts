import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import { ITemplateOptions } from './types';

export default async function (templateDir: string, destDir: string, options: ITemplateOptions): Promise<void> {
  const templateTmpDir = path.join(destDir, '.ejs-tmp');
  await fse.emptyDir(templateTmpDir);
  await fse.copy(templateDir, templateTmpDir);

  await new Promise((resolve, reject) => {
    glob(
      '**/*.?(_)ejs',
      {
        cwd: templateTmpDir,
        nodir: true,
        dot: true,
        ignore: ['node_modules/**'],
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(
          files.map((file) => {
            const filepath = path.join(templateTmpDir, file);
            return renderFile(filepath, options);
          }),
        )
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      },
    );
  });

  await fse.copy(templateTmpDir, destDir);
  await fse.remove(templateTmpDir);
}

function renderFile(filepath: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (filepath.endsWith('_ejs')) {
      const templateFilePath = filepath.replace(/_ejs$/, 'ejs');
      fse.renameSync(filepath, templateFilePath);
      resolve();
    } else {
      ejs.renderFile(filepath, options, (err, result) => {
        if (err) {
          return reject(err);
        }
        fse.removeSync(filepath);
        fse.writeFileSync(filepath.replace(/\.ejs$/, ''), result);
        resolve();
      });
    }
  });
}
