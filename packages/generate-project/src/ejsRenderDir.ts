import * as path from 'path';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import type { Data as ejsData } from 'ejs';
import formatFileContent from './formatFileContent';

import glob = require('glob');

export default async function ejsRenderDir(dir: string, data: ejsData): Promise<void> {
  const files: string[] = await new Promise((resolve, reject) => {
    glob(
      '**/*.ejs',
      {
        cwd: dir,
        nodir: true,
        dot: true,
        ignore: ['node_modules/**'],
      },
      (error, matches) => {
        if (error) {
          reject(error);
        }
        resolve(matches);
      }
    );
  });

  await Promise.all(
    files.map((file) => {
      const filepath = path.join(dir, file);
      return renderAndFormatFile(filepath, data);
    }),
  )
}

async function renderAndFormatFile(filepath: string, data: ejsData): Promise<void> {
  const fileContent = await ejs.renderFile(filepath, data);
  await fse.writeFile(filepath.replace(/\.ejs$/, ''), formatFileContent(fileContent));
  await fse.remove(filepath);
}
