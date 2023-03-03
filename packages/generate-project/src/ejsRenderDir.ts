import * as path from 'path';
import { glob } from 'glob';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import type { Data as ejsData } from 'ejs';
import formatFileContent from './formatFileContent';

export default async function ejsRenderDir(dir: string, data: ejsData): Promise<void> {
  const files: string[] = await glob(
    '**/*.ejs',
    {
      cwd: dir,
      nodir: true,
      dot: true,
      ignore: ['node_modules/**'],
    },
  );
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
