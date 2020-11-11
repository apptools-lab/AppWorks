import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './views/timerProvider';
import { logIt, openFileInEditor } from './utils/common';
import { KeystrokeStatsRecorder } from './recorders/keystrokeStats';
import { createTimerStatusBar } from './views/timerStatusBar';
import { activate as activateWalkClock, deactivate as deactivateWalkClock } from './managers/walkClock';
import { generateProjectSummaryReport, generateUserSummaryReport } from './managers/data';

let keystrokeStatsRecorder: KeystrokeStatsRecorder;

export async function activate(context: ExtensionContext) {
  logIt('[extension] activate!');
  const { subscriptions } = context;

  activateWalkClock();

  const timerProvider = new TimerProvider(context);
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

  const timerStatusBar = await createTimerStatusBar();
  timerStatusBar.show();

  keystrokeStatsRecorder = new KeystrokeStatsRecorder();
  keystrokeStatsRecorder.activate();

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (fsPath: string) => {
      openFileInEditor(fsPath);
    }),
    commands.registerCommand('iceworks-time-master.sendKeystrokeStatsMap', () => {
      keystrokeStatsRecorder.sendKeystrokeStatsMap();
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
    commands.registerCommand('iceworks-time-master.generateProjectSummaryReport', () => {
      generateProjectSummaryReport();
    }),
    commands.registerCommand('iceworks-time-master.generateUserSummaryReport', () => {
      generateUserSummaryReport();
    }),
  );
}

export function deactivate() {
  logIt('[extension] deactivate!');

  keystrokeStatsRecorder.deactivate();

  deactivateWalkClock();
}
