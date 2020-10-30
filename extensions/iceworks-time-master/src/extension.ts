import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './timerProvider';
import { logIt, openFileInEditor } from './utils/common';
import { createInstance as createKpmInstance } from './managers/kpm';
import { createTimerStatusBar } from './timerStatusBar';
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

  const timerStatusBar = createTimerStatusBar();
  timerStatusBar.show();

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (fsPath: string) => {
      openFileInEditor(fsPath);
    }),
    commands.registerCommand('iceworks-time-master.sendKeystrokeStatsMap', () => {
      kpmInstance.sendKeystrokeStatsMap();
    }),
    commands.registerCommand('iceworks-time-master.refreshTimerTree', () => {
      timerProvider.refresh();
    }),
    commands.registerCommand('iceworks-time-master.refreshTimerStatusBar', () => {
      timerStatusBar.refresh();
    }),
    commands.registerCommand('iceworks-time-master.displayTimerTree', () => {
      // TODO
    }),
    commands.registerCommand('iceworks-time-master.generateProjectSummary', () => {
      // TODO
    }),
    commands.registerCommand('iceworks-time-master.generateUserSummary', () => {
      // TODO
    }),
  );
}

export function deactivate() {
  logIt('[extension] deactivate!');
}
