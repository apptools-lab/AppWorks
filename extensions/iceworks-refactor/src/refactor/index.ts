import * as fs from 'fs';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import traverse from './traverse';
import generate from './generate';
import parse from './parse';
import prettierFormat from '../utils/prettierFormat';

export function removeComponentCode(refactoredSourcePath: string, componentSourcePath: string) {
  const source = fs.readFileSync(refactoredSourcePath, { encoding: 'utf-8' });
  const sourceAST = parse(source);
  const hasImportedComponent = traverse(sourceAST, refactoredSourcePath, componentSourcePath);
  if (hasImportedComponent) {
    const code = generate(sourceAST);
    const formattedCode = prettierFormat(code);
    const originCode = fs.readFileSync(refactoredSourcePath);

    const uri = Uri.file(refactoredSourcePath);
    workspace.openTextDocument(uri).then(document => {
      // get current file content range
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const textRange = new Range(firstLine.range.start, lastLine.range.end);

      const edit = new WorkspaceEdit();
      edit.replace(uri, textRange, formattedCode);

      return workspace.applyEdit(edit).then(success => {
        if (success) {
          window.showTextDocument(document);
        } else {
          fs.writeFileSync(refactoredSourcePath, originCode);
          console.log(`Fail to write code to ${refactoredSourcePath}.`);
        }
      });
    });

    return formattedCode;
  }

  return '';
}
