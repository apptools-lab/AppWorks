import { glob } from 'glob';

export default function getFiles(
  directory: string,
  ignoreDirs = ['build', 'dist', 'lib', 'node_modules'],
  supportExts = ['js', 'jsx', 'ts', 'tsx']
): string[] {
  return glob.sync(`${directory}/**/*.+(${supportExts.join('|')})`, {
    nodir: true,
    ignore: ignoreDirs.map(ignoreDir => `${directory}/**/${ignoreDir}/**`)
  });
}