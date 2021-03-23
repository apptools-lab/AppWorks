import * as fs from 'fs';
import traverse from './traverse';
import generate from './generate';
import parse from './parse';
import prettierFormat from '../utils/prettierFormat';

export function removeComponentCode(refactoredSourcePath: string, componentSourcePath: string) {
  const source = fs.readFileSync(refactoredSourcePath, { encoding: 'utf-8' });
  const sourceAST = parse(source);
  traverse(sourceAST, refactoredSourcePath, componentSourcePath);
  const code = generate(sourceAST);
  const formattedCode = prettierFormat(code);

  return formattedCode;
}
