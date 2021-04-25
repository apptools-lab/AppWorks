import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import generate from './generateCode';
import parse from './parser';
import {
  findImportSpecifiers,
  removeUselessReferences,
  removeElement,
  findUnreferencedIdentifiers,
} from './modules';
import executeModules from './utils/executeModules';
import prettierFormat from '../utils/prettierFormat';

/**
 * Remove component in sourcePath
 * @param sourcePath the file path which will be removed code
 * @param resourcePath the file path of the component
 * @param projectLanguageType ts | js
 */
export default async function removeComponent(
  sourcePath: string,
  resourcePath: string,
  projectLanguageType: string,
) {
  let sourceCode = fse.readFileSync(sourcePath, { encoding: 'utf-8' });

  const removeElementsModules = [
    findImportSpecifiers,
    findUnreferencedIdentifiers,
    removeElement,
  ];
  /**
   * removeUselessReferences should in the next task
   * because after elements was removed, the reference relation won't be updated in ast object
   * only when generating new ast again, it will.
   */
  const removeUselessReferencesModules = [removeUselessReferences];
  const executeTasks = [
    removeElementsModules,
    removeUselessReferencesModules,
  ];

  const options = {
    sourcePath,
    resourcePath,
    projectLanguageType,
  };
  let ret = { };
  let index = 0;
  for (const task of executeTasks) {
    const ast = parse(sourceCode);
    ret = { ...ret, ast };
    const { skip } = executeModules(task, ret, options);
    if (skip) {
      break;
    }
    index += 1;
    sourceCode = generate(ast);
  }
  // execute all tasks
  if (index === executeTasks.length) {
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
