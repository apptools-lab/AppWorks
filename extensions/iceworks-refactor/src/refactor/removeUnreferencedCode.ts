import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import generate from './generateCode';
import parse from './parser';
import {
  removeUselessReferences,
  findUnreferencedIdentifiers,
} from './modules';
import executeModules from './utils/executeModules';
import prettierFormat from '../utils/prettierFormat';

/**
 * remove the unreferenced code depends on the origin code and the modified code
 * e.g.:
 *  originSourceCode:
 *  `function App() {
 *    const name = 1;
 *    return { <View>{name}</View> }
 *  }`
 *  modifiedSourceCode:
 *  `function App() {
 *    const name = 1;
 *    return { }
 *  }`
 * after call this function:
 *  `function App() {
 *    return { }
 *  }`
 */
export default async function removeUnreferencedCode(
  sourcePath: string,
  originSourceCode: string,
  modifiedSourceCode: string,
  placeholder: string,
) {
  const findSourceUnreferencedIdentifiersTask = {
    sourceCode: originSourceCode,
    modules: [findUnreferencedIdentifiers],
  };
  const removeUselessReferencesTask = {
    sourceCode: modifiedSourceCode,
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
