import { ExtensionContext, commands } from 'vscode';
import { recordDAU } from '@iceworks/recorder';
import { createTimerTreeView, TimerProvider, createTimerStatusBar, autoSetEnableViewsConfig } from './views';
import { openFileInEditor } from './utils/common';
import { getInterface as getKeystrokeStats } from './recorders/keystrokeStats';
import { getInterface as getUsageStatsRecorder } from './recorders/usageStats';
import { activate as activateWalkClock, deactivate as deactivateWalkClock } from './managers/walkClock';
import { generateProjectSummaryReport, generateUserSummaryReport } from './managers/data';
import logger from './utils/logger';
import recorder from './utils/recorder';

const keystrokeStatsRecorder = getKeystrokeStats();
const usageStatsRecorder = getUsageStatsRecorder();

export async function activate(context: ExtensionContext) {
  const { subscriptions, globalState } = context;

  console.log('Congratulations, your extension "iceworks-time-master" is now active!');
  recorder.recordActivate();

  autoSetEnableViewsConfig(globalState);

  // create views
  const timerProvider = new TimerProvider(context);
  const timerTreeView = createTimerTreeView(timerProvider);
  timerProvider.bindView(timerTreeView);

  const timerStatusBar = await createTimerStatusBar();
  timerStatusBar.activate();

  subscriptions.push(
    commands.registerCommand('iceworks-time-master.openFileInEditor', (fsPath: string) => {
      openFileInEditor(fsPath);
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'openFileInEditor',
      });
    }),
    commands.registerCommand('iceworks-time-master.refreshTimerTree', () => {
      timerProvider.refresh();
    }),
    commands.registerCommand('iceworks-time-master.refreshTimerStatusBar', () => {
      timerStatusBar.refresh();
    }),
    commands.registerCommand('iceworks-time-master.displayTimerTree', () => {
      timerProvider.revealTreeView();
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'displayTimerTree',
      });
    }),
    commands.registerCommand('iceworks-time-master.generateProjectSummaryReport', () => {
      generateProjectSummaryReport();
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'generateProjectSummaryReport',
      });
    }),
    commands.registerCommand('iceworks-time-master.generateUserSummaryReport', () => {
      generateUserSummaryReport();
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'generateUserSummaryReport',
      });
    }),
  );

  // do not wait for async, let subsequent views be created
  activateWalkClock().catch((e) => {
    logger.error('[TimeMaster][extension] activate walkClock got error:', e);
  });

  keystrokeStatsRecorder.activate().catch((e) => {
    logger.error('[TimeMaster][extension] activate keystrokeStatsRecorder got error:', e);
  });
  usageStatsRecorder.activate().catch((e) => {
    logger.error('[TimeMaster][extension] activate usageStatsRecorder got error:', e);
  });
}

export async function deactivate() {
  logger.debug('[TimeMaster][extension] deactivate!');

  try {
    await Promise.all([
      keystrokeStatsRecorder.deactivate(),
      usageStatsRecorder.deactivate(),
    ]);
  } catch (e) {
    logger.error('[TimeMaster][extension] deactivate recorders got error:', e);
  }

  try {
    await deactivateWalkClock();
  } catch (e) {
    logger.error('[TimeMaster][extension] deactivate walkClock got error:', e);
  }
}
