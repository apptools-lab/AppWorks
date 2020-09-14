import * as path from 'path';
import * as fs from 'fs-extra';
import ts2js from './ts2js';
import { IFileEntity, IBabelOption, IOption, Action } from './typing';

function parse(fileList: IFileEntity[], option: IBabelOption = {}) {
  // Get js from ts
  const jsFiles = ts2js(fileList, option);

  return jsFiles;
}

function sylvanas(files: string[], option: IOption) {
  const cwd = option.cwd || process.cwd();
  const outDir = option.outDir || cwd;
  const action: Action = option.action || 'none';

  const fileList: IFileEntity[] = files.map(
    (file): IFileEntity => {
      const filePath = path.resolve(cwd, file);
      const targetFilePath = path.resolve(outDir, file.replace(/\.ts$/, '.js').replace(/\.tsx$/, '.jsx'));

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

export = sylvanas;
