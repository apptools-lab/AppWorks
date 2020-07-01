import * as path from 'path';
import { templateExtnames } from './constant';

export default function checkTemplate(fsPath: string): boolean {
  const fsExtname = path.extname(fsPath);
  return templateExtnames.indexOf(fsExtname) !== -1;
}