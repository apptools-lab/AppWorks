import * as vscode from 'vscode';
import { NodeDepTypes } from '../types';
import runScript from '../terminal/runScript';
import i18n from '../i18n';

export default async function showDepsInputBox(nodeDependenciesInstance: any, depType: NodeDepTypes) {
  const result = await vscode.window.showInputBox({
    placeHolder: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.placeHolder'),
    prompt: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.prompt', { depType }),
  });
  if (!result) {
    return;
  }
  const script = nodeDependenciesInstance.getAddDependencyScript(depType, result);
  const { title } = script;
  const [cwd, scriptCommand] = script.arguments;
  runScript(title, cwd, scriptCommand);
}
