import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './timerProvider';
import { logIt, openFileInEditor } from './utils/common';
import { createInstance as createKpmInstance } from './managers/kpm';
import { activate as activateWalkClock } from './managers/walkClock';

// eslint-disable-next-line
const { name } = require('../package.json');

export async function activate(context: ExtensionContext) {
  logIt('[extension] activate!');
  const { subscriptions } = context;

  const timerProvider = new TimerProvider();
  createTimerTreeView(timerProvider);

  activateWalkClock();

  const kpmInstance = createKpmInstance();
  kpmInstance.activate();

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (file: string) => {
      openFileInEditor(file);
    }),
    commands.registerCommand('iceworks-time-master.sendKeystrokeStats', () => {
      kpmInstance.sendKeystrokeStats();
    }),
    commands.registerCommand('iceworks-time-master.refreshTimerTree', () => {
      timerProvider.refresh();
    }),
  );
}

export function deactivate() {
  logIt('[extension] deactivate!');
}
