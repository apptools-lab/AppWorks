import * as vscode from 'vscode';
import { nodeDepTypes } from '../constants';
import { NodeDepTypes } from '../types';
import showDepsInputBox from '../inputBoxs/showDepsInputBox';
import i18n from '../i18n';

export default function showDepsQuickPick(nodeDependenciesInstance: any) {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = nodeDepTypes.map((label) => ({
    label,
    detail: i18n.format('extension.iceworksApp.showDepsQuickPick.quickPickItem.detail', { label }),
  }));
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      showDepsInputBox(nodeDependenciesInstance, selection[0].label as NodeDepTypes).catch(console.error);
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
