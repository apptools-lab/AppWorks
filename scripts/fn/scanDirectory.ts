import * as path from 'path';
import * as fse from 'fs-extra';
import * as junk from 'junk';
import * as orderBy from 'lodash.orderby';

export default async (directoryPath: string): Promise<string[]> => {
  const isExist = await fse.pathExists(directoryPath);
  if (!isExist) {
    throw new Error(`${directoryPath} is not exist.`);
  }

  const files = await fse.readdir(directoryPath);
  const targetFiles = [];
  await Promise.all(files.map(async (filename: string) => {
    const targetPath = path.join(directoryPath, filename);
    let stats;
    try {
      stats = await fse.lstat(targetPath);
    } catch (err) {
      console.warn('lstatAsync got error:', err);
    }

    const isDirectory = stats &&
      stats.isDirectory() &&
      junk.not(filename) &&
      filename.indexOf('.') !== 0;
    if (isDirectory) {
      try {
        await fse.access(targetPath, fse.constants.R_OK);
        targetFiles.push(filename);
      } catch (error) {
        console.warn('accessAsync got error:', error);
      }
    }
  }));

  return orderBy(targetFiles);
};
