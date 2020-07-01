import * as path from 'path';

export default function checkTemplate(fsPath: string): boolean {
  const fsExtname = path.extname(fsPath);
  return this.templateExtnames.indexOf(fsExtname) !== -1;
}