import { ExtensionContext, commands } from 'vscode';
import { createTimerTreeView, TimerProvider } from './views/timerProvider';
import { openFileInEditor } from './utils/common';
import { getInterface as getKeystrokeStats } from './recorders/keystrokeStats';
import { getInterface as getWathStatsRecorder } from './recorders/watchStats';
import { createTimerStatusBar } from './views/timerStatusBar';
import { activate as activateWalkClock, deactivate as deactivateWalkClock } from './managers/walkClock';
import { generateProjectSummaryReport, generateUserSummaryReport } from './managers/data';
import logger from './utils/logger';

const keystrokeStatsRecorder = getKeystrokeStats();
const wathStatsRecorder = getWathStatsRecorder();

export async function activate(context: ExtensionContext) {
  logger.debug('[TimeMaster][extension] activate!');
  const { subscriptions } = context;

  // do not wait for async, let subsequent views be created
  activateWalkClock();

  const timerProvider = new TimerProvider(context);
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

  const timerStatusBar = await createTimerStatusBar();
  timerStatusBar.show();

  keystrokeStatsRecorder.activate().catch((e) => {
    logger.error('[TimeMaster][extension] activate keystrokeStatsRecorder got error:', e);
  });
  wathStatsRecorder.activate().catch((e) => {
    logger.error('[TimeMaster][extension] activate wathStatsRecorder got error:', e);
  });

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (fsPath: string) => {
      openFileInEditor(fsPath);
    }),
    commands.registerCommand('iceworks-time-master.sendKeystrokeStatsMap', () => {
      keystrokeStatsRecorder.sendData();
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
  logger.debug('[TimeMaster][extension] deactivate!');

  keystrokeStatsRecorder.deactivate().catch((e) => {
    logger.error('[TimeMaster][extension] deactivate keystrokeStatsRecorder got error:', e);
  });
  wathStatsRecorder.deactivate().catch((e) => {
    logger.error('[TimeMaster][extension] deactivate wathStatsRecorder got error:', e);
  });

  deactivateWalkClock();
}
