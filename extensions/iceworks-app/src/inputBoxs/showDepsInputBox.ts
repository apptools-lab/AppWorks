import * as vscode from 'vscode';
import { NodeDepTypes } from '../types';
import executeCommand from '../commands/executeCommand';
import i18n from '../i18n';

export default async function showDepsInputBox(nodeDependenciesInstance: any, depType: NodeDepTypes) {
  const result = await vscode.window.showInputBox({
    placeHolder: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.placeHolder'),
    prompt: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.prompt', { depType }),
  });
  if (!result) {
    return;
  }
  executeCommand(nodeDependenciesInstance.getAddDependencyScript(depType, result));
}
