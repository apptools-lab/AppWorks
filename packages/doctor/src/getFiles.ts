import * as fs from 'fs-extra';
import { glob } from 'glob';
import { IFileInfo } from './types/Scanner';

// Supprot check file's max LoC
const MAX_CHECK_LOC = 3000;

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

export default function getFiles(directory: string, supportExts: string[], ignore?: string[]): IFileInfo[] {
  const options: any = {
    nodir: true,
  };

  if (ignore) {
    options.ignore = ignore.map((ignoreDir) => `${directory}/**/${ignoreDir}/**`);
  }

  if (!fs.existsSync(directory)) {
    return [];
  }

  try {
    const stat = fs.statSync(directory);
    if (stat.isFile()) {
      return [getFileInfo(directory)];
    }

    // https://www.npmjs.com/package/glob
    return glob.sync(`${directory}/**/*.+(${supportExts.join('|')})`, options).map(getFileInfo).filter(file => file.LoC <= MAX_CHECK_LOC);
  } catch (e) {
    console.log('Get files failed!', e);
    return [];
  }
}
