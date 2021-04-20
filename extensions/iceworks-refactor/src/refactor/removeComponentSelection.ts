import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import generate from './generateCode';
import parse from './parser';
import {
  removeUselessReferences,
  findUnreferencedIdentifiers,
} from './modules';
import executeModules from './utils/executeModules';
import prettierFormat from '../utils/prettierFormat';

export default async function removeComponentSelection(
  removedSelectionCode: string,
  sourcePath: string,
  placeholder: string,
) {
  const findSourceUnreferencedIdentifiersTask = {
    sourceCode: fse.readFileSync(sourcePath, { encoding: 'utf-8' }),
    modules: [findUnreferencedIdentifiers],
  };
  const removeUselessReferencesTask = {
    sourceCode: removedSelectionCode,
    modules: [removeUselessReferences],
  };
  const executeTasks = [
    findSourceUnreferencedIdentifiersTask,
    removeUselessReferencesTask,
  ];

  let code;
  const options = { sourcePath, removedNodePaths: [] };
  let ret = {};
  for (const task of executeTasks) {
    const { sourceCode, modules } = task;
    const ast = parse(sourceCode);
    ret = { ...ret, ast };
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
