import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import prettierFormat from '../utils/prettierFormat';
import generate from './utils/generate';
import parse from './utils/parse';
import {
  removeDeadReferences,
  findUnreferencedIdentifiers,
} from './parsers';
import executeModules from './utils/executeModules';

export default function removeComponentSnippet(
  removeSnippetCode: string,
  sourcePath: string,
) {
  const options = { sourcePath };

  const removeSnippetTask = {
    sourceCode: fse.readFileSync(sourcePath, { encoding: 'utf-8' }),
    module: [findUnreferencedIdentifiers],
  };
  const removeDeadReferencesTask = {
    sourceCode: removeSnippetCode,
    module: [removeDeadReferences],
  };

  const executeTasks = [
    removeSnippetTask,
    removeDeadReferencesTask,
  ];

  let code;
  for (const task of executeTasks) {
    const { sourceCode, module } = task;
    const ast = parse(sourceCode);
    const ret = { ast };
    executeModules(module, 'parse', ret, options);
    code = generate(ast);
  }

  const formattedCode = prettierFormat(code);
  const uri = Uri.file(sourcePath);
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
        fse.writeFileSync(sourcePath, code);
        console.log(`Fail to write code to ${sourcePath}.`);
      }
    });
  });
}
