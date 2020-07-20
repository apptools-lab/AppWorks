import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';

export default async function(dir: string, options: any, diableFormatDotFile?: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    glob('**', {
      cwd: dir,
      nodir: true,
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      Promise.all(files.map((file) => {
        const filepath = path.join(dir, file);
        return renderFile(filepath, options, diableFormatDotFile);
      })).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  });
};

function renderFile(filepath: string, options: any, diableFormatDotFile: boolean): Promise<string> {
  let filename = path.basename(filepath);

  return new Promise((resolve, reject) => {
    ejs.renderFile(filepath, options, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (/^_package.json/.test(filename)) {
        filename = filename.replace('_package.json', 'package.json');
        fse.removeSync(filepath);
      }

      if (/\.ejs$/.test(filepath)) {
        filename = filename.replace(/\.ejs$/, '');
        fse.removeSync(filepath);
      }

      if (!diableFormatDotFile && /^_/.test(filename)) {
        filename = filename.replace(/^_/, '.');
        fse.removeSync(filepath);
      }

      const newFilepath = path.join(filepath, '../', filename);
      fse.writeFileSync(newFilepath, result);
      resolve(newFilepath);
    });
  });
}
