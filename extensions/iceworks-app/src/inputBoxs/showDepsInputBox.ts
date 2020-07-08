import * as vscode from 'vscode';
import { NodeDepTypes, ITerminalMap } from '../types';
import executeCommand from '../commands/executeCommand';

export default async function showDepsInputBox(terminals: ITerminalMap, nodeDependenciesInstance: any, depType: NodeDepTypes) {
  const result = await vscode.window.showInputBox({
    placeHolder: 'Please input the module name you want to install. For example lodash / loadsh@latest',
  });
  if (!result) {
    return;
  }
  executeCommand(terminals, nodeDependenciesInstance.getAddDependencyScript(depType, result));
}
