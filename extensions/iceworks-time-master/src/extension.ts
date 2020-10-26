import * as vscode from 'vscode';
import { registerCommand } from '@iceworks/common-service';
import { createTreeView } from './TreeDataProvider';

// eslint-disable-next-line
const { name } = require('../package.json');

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions } = context;

  createTreeView(context);

  subscriptions.push(
    registerCommand('iceworks-time-master.refresh', () => {
      vscode.window.showInformationMessage('refresh!!!.');
    }),
  );
}

export function deactivate() {
}
