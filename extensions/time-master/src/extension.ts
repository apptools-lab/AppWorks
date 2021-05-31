import { ExtensionContext, commands, window, WindowState } from 'vscode';
import { recordDAU } from '@appworks/recorder';
import { openFileInEditor } from '@appworks/common-service';
import { getInterface as getKeystrokeStats } from './recorders/keystrokeStats';
import { getInterface as getUsageStatsRecorder } from './recorders/usageStats';
import { activate as activateWalkClock, deactivate as deactivateWalkClock } from './managers/walkClock';
import { generateProjectSummaryReport, generateUserSummaryReport } from './managers/data';
import logger from './utils/logger';
import recorder from './utils/recorder';
import { init as initViews } from './views';
import { sendPayload } from './utils/sender';

const keystrokeStatsRecorder = getKeystrokeStats();
const usageStatsRecorder = getUsageStatsRecorder();

export async function activate(context: ExtensionContext) {
  const { subscriptions } = context;

  console.log('Congratulations, your extension "time-master" is now active!');
  recorder.recordActivate();

  await initViews(context);

  subscriptions.push(
    commands.registerCommand('appworks-time-master.openFileInEditor', async (fsPath: string) => {
      try {
        await openFileInEditor(fsPath);
      } catch (e) {
        window.showErrorMessage(e.message);
      }

      recordDAU();
      recorder.record({
        module: 'command',
        action: 'openFileInEditor',
      });
    }),
    commands.registerCommand('appworks-time-master.generateProjectSummaryReport', () => {
      generateProjectSummaryReport();
      recordDAU();
      recorder.record({
        module: 'command',
        action: 'generateProjectSummaryReport',
      });
    }),
    commands.registerCommand('appworks-time-master.generateUserSummaryReport', () => {
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

  /**
   * Should add event handle after recorders activated
   * Because recorder will append playload for sender
   */
  window.onDidChangeWindowState((windowState: WindowState) => {
    if (!windowState.focused) {
      sendPayload().catch((e) => {
        logger.error('[TimeMaster][extension] sendPayload got error:', e);
      });
    }
  });
}

export async function deactivate() {
  logger.disable('console');
  logger.info('[TimeMaster][extension][deactivate] start!');

  try {
    await Promise.all([
      keystrokeStatsRecorder.deactivate(),
      usageStatsRecorder.deactivate(),
    ]);
  } catch (e) {
    logger.error('[TimeMaster][extension][deactivate] recorders got error:', e);
  }

  logger.info('[TimeMaster][extension][deactivate] recorders success!');

  try {
    await deactivateWalkClock();
  } catch (e) {
    logger.error('[TimeMaster][extension][deactivate] walkClock got error:', e);
  }

  logger.info('[TimeMaster][extension][deactivate] walkClock success!');

  logger.info('[TimeMaster][extension][deactivate] done!');
}
