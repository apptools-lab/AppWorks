import * as vscode from 'vscode';
import { registerCommand } from '@iceworks/common-service';
import { createTimerTreeView } from './TimerProvider';

// eslint-disable-next-line
const { name } = require('../package.json');

export async function activate(context: vscode.ExtensionContext) {
  const { subscriptions } = context;

  createTimerTreeView();

  subscriptions.push(
    registerCommand('iceworks-time-master.refresh', () => {
      vscode.window.showInformationMessage('refresh!!!.');
    }),
  );
}

export function deactivate() {
}
