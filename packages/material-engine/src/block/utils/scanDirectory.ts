import * as path from 'path';
import * as fs from 'fs-extra';
import * as junk from 'junk';

/**
 * Given a directory, scan the directory below
 *
 * @param directoryPath
 */
export const scanDirectory = async (directoryPath: string): Promise<string[]> => {
  const files = await fs.readdir(directoryPath);
  const targetFiles: any[] = [];
  await Promise.all(
    files.map(async (filename: string) => {
      const targetPath = path.join(directoryPath, filename);
      let stats;
      try {
        stats = await fs.lstat(targetPath);
      } catch (err) {
        console.warn('lstatAsync got error:', err);
      }

      const isDirectory = stats && stats.isDirectory() && junk.not(filename) && filename.indexOf('.') !== 0;
      if (isDirectory) {
        try {
          await fs.access(targetPath, fs.constants.R_OK);
          targetFiles.push(filename);
        } catch (error) {
          console.warn('accessAsync got error:', error);
        }
      }
    }),
  );

  return targetFiles;
};
