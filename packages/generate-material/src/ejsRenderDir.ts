import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';

export default async function(dir: string, options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    glob('**/*.ejs', {
      cwd: dir,
      nodir: true,
      ignore: ['node_modules/**'],
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      Promise.all(files.map((file) => {
        const filepath = path.join(dir, file);
        return renderFile(filepath, options);
      })).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

function renderFile(filepath: string, options: any): Promise<string> {
  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }

      fse.removeSync(filepath);
      fse.writeFileSync(filepath.replace(/\.ejs$/, ''), result);
      resolve();
    });
  });
}
