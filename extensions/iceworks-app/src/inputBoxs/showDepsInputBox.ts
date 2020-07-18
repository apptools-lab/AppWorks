import * as vscode from 'vscode';
import { NodeDepTypes, ITerminalMap } from '../types';
import executeCommand from '../commands/executeCommand';
import {i18n} from '../i18n';

export default async function showDepsInputBox(terminals: ITerminalMap, nodeDependenciesInstance: any, _depType: NodeDepTypes) {
  const result = await vscode.window.showInputBox({
    placeHolder: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.placeHolder'),
    prompt: i18n.format('extension.iceworksApp.showDepsInputBox.materialImport.prompt',{depType: _depType})
  });
  if (!result) {
    return;
  }
  executeCommand(terminals, nodeDependenciesInstance.getAddDependencyScript(_depType, result));
}
