import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './timerProvider';
import { logIt, openFileInEditor } from './utils/common';
import { createInstance as createKpmInstance } from './managers/kpm';
import { createTimerStatusBar } from './timerStatusBar';
import { activate as activateWalkClock } from './managers/walkClock';
import { generateProjectSummaryDashboard, generateUserSummaryDashboard } from './managers/data';

export async function activate(context: ExtensionContext) {
  logIt('[extension] activate!');
  const { subscriptions } = context;

  const timerProvider = new TimerProvider();
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

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
      timerProvider.revealTreeView();
    }),
    commands.registerCommand('iceworks-time-master.generateProjectSummaryDashboard', () => {
      generateProjectSummaryDashboard();
    }),
    commands.registerCommand('iceworks-time-master.generateUserSummaryDashboard', () => {
      generateUserSummaryDashboard();
    }),
  );
}

export function deactivate() {
  logIt('[extension] deactivate!');
}
