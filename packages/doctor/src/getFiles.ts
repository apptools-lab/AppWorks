import * as fs from 'fs-extra';
import { glob } from 'glob';
import { IFileInfo } from './types/Scanner';

// https://www.npmjs.com/package/glob
export default function getFiles(directory: string, supportExts: string[], ignoreDirs?: string[]): IFileInfo[] {
  const options: any = {
    nodir: true,
  };

  if (ignoreDirs) {
    options.ignore = ignoreDirs.map((ignoreDir) => `${directory}/**/${ignoreDir}/**`);
  }

  return glob.sync(`${directory}/**/*.+(${supportExts.join('|')})`, options).map((filePath) => {
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
  });
}
