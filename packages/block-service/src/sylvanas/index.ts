import * as path from 'path';
import * as fs from 'fs-extra';

import ts2js from './ts2js';
// import eslintJs from './eslintJs';
// import prettierJS from './prettierJs';
import { IFileEntity, IBabelOption, IOption, Action } from './typing';

function parse(fileList: IFileEntity[], option: IBabelOption = {}) {
  // Get js from ts
  console.log('Get js from ts')
  const jsFiles = ts2js(fileList, option);
  console.log('get js from ts end');

  // // eslint
  // const lintFiles = eslintJs(jsFiles);

  // // prettier
  // const prettierFiles = prettierJS(lintFiles);

  // return prettierFiles;
  return jsFiles;
}

function sylvanas(files: string[], option: IOption) {
  const cwd = option.cwd || process.cwd();
  const outDir = option.outDir || cwd;
  const action: Action = option.action || 'none';

  const fileList: IFileEntity[] = files.map(
    (file): IFileEntity => {
      const filePath = path.resolve(cwd, file);
      const targetFilePath = path.resolve(
        outDir,
        file.replace(/\.ts$/, '.js').replace(/\.tsx$/, '.jsx'),
      );

      return {
        sourceFilePath: filePath,
        targetFilePath,
        data: fs.readFileSync(filePath, 'utf8'),
      };
    },
  );

  const parsedFileList = parse(fileList, option);

  if (action === 'write' || action === 'overwrite') {
    parsedFileList.forEach(({ sourceFilePath, targetFilePath, data }) => {
      fs.ensureFileSync(targetFilePath);
      fs.writeFileSync(targetFilePath, data);

      if (action === 'overwrite') {
        fs.unlinkSync(sourceFilePath);
      }
    });
  }

  return parsedFileList;
}

sylvanas.parseText = function parseText(text: string, option: IBabelOption = {}): string {
  const result = parse(
    [
      {
        sourceFilePath: '',
        data: text,
      },
    ],
    option,
  );

  return result[0].data;
};

export default sylvanas;
