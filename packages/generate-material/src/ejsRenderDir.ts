import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import { ITemplateOptions } from './index';

export default async function (dir: string, options: ITemplateOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    glob(
      '**/*.?(_)ejs',
      {
        cwd: dir,
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
            const filepath = path.join(dir, file);
            return renderFile(filepath, options);
          })
        )
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  });
}

function renderFile(filepath: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    if (filepath.endsWith('_ejs')) {
      const templateFilePath = filepath.replace('_ejs', 'ejs');
      try {
        fse.renameSync(filepath, templateFilePath);
      } catch (err) {
        reject(err);
      }
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
