import * as vscode from 'vscode';
import { showExtensionsQuickPickCommandId } from '../constants';

export default function createExtensionsStatusBar() {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = 'Iceworks';
  statusBarItem.command = showExtensionsQuickPickCommandId;
  statusBarItem.show();
  return statusBarItem;
}