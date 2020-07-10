import * as vscode from 'vscode';
import { NodeDepTypes, ITerminalMap } from '../types';
import executeCommand from '../commands/executeCommand';

export default async function showDepsInputBox(terminals: ITerminalMap, nodeDependenciesInstance: any, depType: NodeDepTypes) {
  const result = await vscode.window.showInputBox({
    placeHolder: '例如: lodash react@latest',
    prompt: `请输入需要添加到 ${depType} 的依赖名称, 支持通过空格添加多个依赖`
  });
  if (!result) {
    return;
  }
  executeCommand(terminals, nodeDependenciesInstance.getAddDependencyScript(depType, result));
}
