import { window, ProgressLocation, workspace, ViewColumn } from 'vscode';
import { KeystrokeStats, updateFilesSummary as updateFilesSummaryByKeystrokeStats } from '../recorders/keystrokeStats';
import { WatchStats, updateFilesSummary as updateFilesSummaryByWatchStats } from '../recorders/watchStats';
import { updateProjectSummary, generateProjectReport } from '../storages/project';
import { updateUserSummary, generateUserReport } from '../storages/user';
import { checkMidnight, refreshViews } from './walkClock';
import { Progress } from '../utils/progress';
import { appendKeystrokesPayload, appendWatchTimePayload } from '../utils/sender';
import logger from '../utils/logger';
import { delay } from '../utils/common';

async function saveDataToDisk(data: KeystrokeStats|WatchStats) {
  const { project } = data;
  const increment = data instanceof KeystrokeStats ?
    await updateFilesSummaryByKeystrokeStats(data) :
    await updateFilesSummaryByWatchStats(data);

  logger.debug('[data][saveDataToDisk] increment', increment);

  await updateProjectSummary(project, increment);
  await updateUserSummary(increment);
  refreshViews();
}

async function appendDataToPayload(data: KeystrokeStats|WatchStats) {
  data instanceof KeystrokeStats ?
    await appendKeystrokesPayload(data) :
    await appendWatchTimePayload(data);
}

// TODO async logic
let isProcessing = false;
export async function processData(data: KeystrokeStats|WatchStats) {
  logger.debug('[data][processData] isProcessing', isProcessing);
  if (!isProcessing) {
    isProcessing = true;
    await checkMidnight();
    await Promise.all([saveDataToDisk, appendDataToPayload].map(async (fn) => {
      await fn(data);
    }));
    isProcessing = false;
  } else {
    await delay(1000);
    await processData(data);
  }
}

function setProgressToGenerateSummaryReport(title: string, generateFn: typeof generateProjectReport | typeof generateUserReport) {
  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title,
      cancellable: false,
    },
    async (progress) => {
      const progressMgr = new Progress(progress);
      progressMgr.start();
      try {
        const filePath = await generateFn();
        const doc = await workspace.openTextDocument(filePath);
        await window.showTextDocument(doc, ViewColumn.One, false);
        progressMgr.done();
      } catch (e) {
        const message = `Generate dashborad got error: ${e}`;
        logger.error(message);
        window.showErrorMessage(message);
      }
    },
  );
}

export function generateProjectSummaryReport() {
  setProgressToGenerateSummaryReport('Loading project summary...', generateProjectReport);
}

export function generateUserSummaryReport() {
  setProgressToGenerateSummaryReport('Loading summary...', generateUserReport);
}
