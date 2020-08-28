import * as _ from 'lodash';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import * as ejs from 'ejs';
import * as util from 'util';

export default async function renderEjsTemplates(templateData: object, templateDir: string) {
  return new Promise((resolve, reject) => {
    glob(
      '**',
      {
        cwd: templateDir,
        ignore: ['node_modules/**'],
        nodir: true,
        dot: true,
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        Promise.all(
          files.map((file) => {
            const filepath = path.join(templateDir, file);
            return renderFile(filepath, templateData);
          })
        )
          .then(() => resolve())
          .catch(reject);
      }
    );
  });
}

async function renderFile(templateFilepath: string, data: any) {
  const asyncRenderFile = util.promisify(ejs.renderFile);
  try {
    const content = await asyncRenderFile(templateFilepath, data);
    const targetFilePath = templateFilepath.replace(/\.ejs$/, '');
    await fse.rename(templateFilepath, targetFilePath);
    await fse.writeFile(targetFilePath, content);
  } catch (err) {
    console.log('RenderErr', err);
  }
}
