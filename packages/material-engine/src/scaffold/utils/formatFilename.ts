import * as fse from 'fs-extra';
import * as readFiles from 'fs-readdir-recursive';
import * as path from 'path';

const formatFilename = (dirPath: string) => {
  const files = readFiles(dirPath);
  files.forEach(file => {
    fse.renameSync(path.join(dirPath, file), path.join(dirPath, file.replace(/^_/, '.')));
  });
};

export default formatFilename;
