import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';

export function create(...args): void {
  console.log(111);
  console.log(args[1])
  const webviewPanel = args[1];
  webviewPanel.dispose();
}
