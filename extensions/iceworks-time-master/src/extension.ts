import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView } from './timerProvider';
import { openFileInEditor } from './utils/common';
import { createInstance as createKpmInstance } from './managers/kpm';
import { activate as activateWalkClock } from './managers/walkClock';

// eslint-disable-next-line
const { name } = require('../package.json');

export async function activate(context: ExtensionContext) {
  const { subscriptions } = context;

  createTimerTreeView();

  activateWalkClock();

  const kpmInstance = createKpmInstance();
  kpmInstance.activate();

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
