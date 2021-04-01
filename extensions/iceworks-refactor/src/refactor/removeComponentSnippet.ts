import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import prettierFormat from '../utils/prettierFormat';
import generate from './generateCode';
import parse from './parser';
import {
  removeDeadReferences,
  findUnreferencedIdentifiers,
} from './modules';
import executeModules from './utils/executeModules';

export default async function removeComponentSnippet(
  removedSnippetCode: string,
  sourcePath: string,
  placeholder: string,
) {
  const removeSnippetTask = {
    sourceCode: fse.readFileSync(sourcePath, { encoding: 'utf-8' }),
    modules: [findUnreferencedIdentifiers],
  };
  const removeDeadReferencesTask = {
    sourceCode: removedSnippetCode,
    modules: [removeDeadReferences],
  };
  const executeTasks = [
    removeSnippetTask,
    removeDeadReferencesTask,
  ];

  let code;
  const options = { sourcePath, removedNodePaths: [] };
  for (const task of executeTasks) {
    const { sourceCode, modules } = task;
    const ast = parse(sourceCode);
    const ret = { ast };
    executeModules(modules, ret, options);
    code = generate(ast);
  }

  const formattedCode = prettierFormat(code).replace(placeholder, '');
  const uri = Uri.file(sourcePath);

  const document = await workspace.openTextDocument(uri);
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const textRange = new Range(firstLine.range.start, lastLine.range.end);

  const edit = new WorkspaceEdit();
  edit.replace(uri, textRange, formattedCode);
  // show the unsaved code
  await workspace.applyEdit(edit);
  window.showTextDocument(document);
}
