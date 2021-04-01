import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import prettierFormat from '../utils/prettierFormat';
import generate from './generateCode';
import parse from './parser';
import {
  findImportSpecifiers,
  removeDeadReferences,
  removeElement,
  findUnreferencedIdentifiers,
} from './modules';
import executeModules from './utils/executeModules';

export default async function removeComponent(
  sourcePath: string,
  resourcePath: string,
  projectLanguageType: string,
) {
  let sourceCode = fse.readFileSync(sourcePath, { encoding: 'utf-8' });

  const removeElementsModules = [
    findUnreferencedIdentifiers,
    findImportSpecifiers,
    removeElement,
  ];
  const removeDeadReferencesModules = [removeDeadReferences];
  const executeTasks = [
    removeElementsModules,
    removeDeadReferencesModules,
  ];

  let shouldRemoveCode = true;
  const options = {
    sourcePath,
    resourcePath,
    projectLanguageType,
  };
  for (const task of executeTasks) {
    const ast = parse(sourceCode);
    const ret = { ast };
    const { done } = executeModules(task, ret, options);
    if (done) {
      shouldRemoveCode = false;
      break;
    }
    sourceCode = generate(ast);
  }

  if (shouldRemoveCode) {
    const formattedCode = prettierFormat(sourceCode);
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

    return formattedCode;
  }
}
