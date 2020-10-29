import { workspace, window, ExtensionContext, commands } from 'vscode';
import { createTimerTreeView } from './timerProvider';
import { openFileInEditor } from './utils/common';
import { createInstance as createKpmInstance, KpmManager } from './managers/kpm';

// eslint-disable-next-line
const { name } = require('../package.json');

function startListeningKpm(kpmInstance: KpmManager) {
  workspace.onDidOpenTextDocument(kpmInstance.onDidOpenTextDocument, kpmInstance);
  workspace.onDidCloseTextDocument(kpmInstance.onDidCloseTextDocument, kpmInstance);
  workspace.onDidChangeTextDocument(kpmInstance.onDidChangeTextDocument, kpmInstance);
  window.onDidChangeWindowState(kpmInstance.onDidChangeWindowState, kpmInstance);
}

export async function activate(context: ExtensionContext) {
  const { subscriptions } = context;

  createTimerTreeView();

  const kpmInstance = createKpmInstance();
  startListeningKpm(kpmInstance);

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (file: string) => {
      openFileInEditor(file);
    }),
    commands.registerCommand('iceworks-time-master.processKeystrokeStats', () => {
      kpmInstance.processKeystrokeStats();
    }),
  );
}

export function deactivate() {
}
