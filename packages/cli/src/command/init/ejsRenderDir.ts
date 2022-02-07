import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';

export default async function (dir: string, options: any): Promise<void> {
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: dir,
      ignore: ['node_modules/**'],
      nodir: true,
      dot: true,
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      Promise.all(files.map((file) => {
        const filepath = path.join(dir, file);
        return renderFile(filepath, options);
      })).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  });
}

function renderFile(filepath: string, options: any): Promise<string> {
  let filename = path.basename(filepath);

  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (/\.ejs$/.test(filepath)) {
        filename = filename.replace(/\.ejs$/, '');
        fse.removeSync(filepath);
      }

      const newFilepath = path.join(filepath, '../', filename);
      fse.writeFileSync(newFilepath, result);
      resolve(newFilepath);
    });
  });
}
