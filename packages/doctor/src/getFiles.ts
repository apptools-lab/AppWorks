import * as fs from 'fs-extra';
import * as path from 'path';
import ignore from 'ignore';
import { glob } from 'glob';
import { IFileInfo } from './types/Scanner';

// Supprot check file's max LoC
const MAX_CHECK_LOC = 3000;

// Get ignore config from file
const IGNORE_CONFIG_FILES = ['.gitignore', '.eslintignore'];

function getFileInfo(filePath: string): IFileInfo {
  let source = fs.readFileSync(filePath).toString().trim();

  // if begins with shebang
  if (source[0] === '#' && source[1] === '!') {
    source = `//${source}`;
  }

  return {
    path: filePath,
    source,
    LoC: (source.match(/\n/g) || '').length + 1,
  };
}

export default function getFiles(directory: string, supportExts: string[], ignoreDirs?: string[]): IFileInfo[] {
  const options: any = {
    nodir: true,
  };

  if (!fs.existsSync(directory)) {
    return [];
  }

  try {
    const ig = ignore();
    const stat = fs.statSync(directory);

    if (stat.isFile()) {
      return [getFileInfo(directory)];
    }

    if (ignoreDirs) {
      options.ignore = ignoreDirs.map((ignoreDir) => `${directory}/**/${ignoreDir}/**`);
    }

    IGNORE_CONFIG_FILES.forEach((ignoreConfigFile) => {
      const ignoreConfigFilePath = path.join(directory, ignoreConfigFile);
      if (fs.existsSync(ignoreConfigFilePath)) {
        ig.add(fs.readFileSync(ignoreConfigFilePath).toString());
      }
    })

    // https://www.npmjs.com/package/glob
    return glob.sync(`${directory}/**/*.+(${supportExts.join('|')})`, options)
      .map(getFileInfo)
      .filter((file) => {
        // https://www.npmjs.com/package/ignore
        // Use .ignore file to filter glob result. Same as https://www.npmjs.com/package/glob-gitignore
        return file.LoC <= MAX_CHECK_LOC && !ig.ignores(file.path.replace(path.join(directory, '/'), ''))
      });
  } catch (e) {
    console.log('Get files failed!', e);
    return [];
  }
}
