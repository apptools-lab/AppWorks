import * as path from 'path';
import * as ejs from 'ejs';
import * as fse from 'fs-extra';
import type { Data as ejsData } from 'ejs';
import formatFileContent from './formatFileContent';
import type { Options } from 'prettier';

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
      },
    );
  });

  await Promise.all(
    files.map((file) => {
      const filepath = path.join(dir, file);
      return renderAndFormatFile(filepath, data);
    }),
  );
}

const parserMaps: Array<[RegExp, string]> = [
  [/\.json$/, 'json'],
  [/\.(ts|tsx|mts|cts)$/, 'babel-ts'],
  [/\.(js|jsx|mjs|cjs)$/, 'babel'],
  [/\.(yml|yaml)$/, 'yaml'],
];

async function renderAndFormatFile(filepath: string, data: ejsData): Promise<void> {
  const fileContent = await ejs.renderFile(filepath, data);
  const realFilepath = filepath.replace(/\.ejs$/, '');

  const formatOptions: Options = {};

  for (const [regexp, parser] of parserMaps) {
    if (regexp.test(realFilepath)) {
      formatOptions.parser = parser;
      continue;
    }
  }

  await fse.writeFile(realFilepath, formatFileContent(fileContent, formatOptions));
  await fse.remove(filepath);
}
