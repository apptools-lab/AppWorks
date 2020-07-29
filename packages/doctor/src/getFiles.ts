import { glob } from 'glob';

// https://www.npmjs.com/package/glob
export default function getFiles(directory: string, supportExts: string[], ignoreDirs?: string[],): string[] {
  const options: any = {
    nodir: true
  }

  if (ignoreDirs) {
    options.ignore = ignoreDirs.map(ignoreDir => `${directory}/**/${ignoreDir}/**`);
  }

  return glob.sync(`${directory}/**/*.+(${supportExts.join('|')})`, options);
}
