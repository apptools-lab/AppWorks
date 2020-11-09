import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './views/timerProvider';
import { logIt, openFileInEditor } from './utils/common';
import { KpmManager } from './managers/kpm';
import { createTimerStatusBar } from './views/timerStatusBar';
import { activate as activateWalkClock, deactivate as deactivateWalkClock } from './managers/walkClock';
import { generateProjectSummaryDashboard, generateUserSummaryDashboard } from './managers/data';

let kpmInstance: KpmManager;

export async function activate(context: ExtensionContext) {
  logIt('[extension] activate!');
  const { subscriptions } = context;

  const timerProvider = new TimerProvider();
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

  const timerStatusBar = await createTimerStatusBar();
  timerStatusBar.show();

  activateWalkClock();

  kpmInstance = new KpmManager();
  kpmInstance.activate();

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
      timerStatusBar.refresh().catch(() => { /* ignore error */ });
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

  kpmInstance.deactivate();

  deactivateWalkClock();
}
