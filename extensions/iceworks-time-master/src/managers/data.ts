import { window, ProgressLocation, workspace, ViewColumn } from 'vscode';
import { KeystrokeStats } from '../recorders/keystrokeStats';
import { updateFilesChangeSummary } from '../storages/filesChange';
import { updateProjectSummary, generateProjectReport } from '../storages/project';
import { updateUserSummary, generateUserReport } from '../storages/user';
import { checkMidnight, refreshViews } from './walkClock';
import { Progress } from '../utils/progress';
import { appendKeystrokesPayload } from '../utils/sender';
import { logIt } from '../utils/common';

async function saveDataToDisk(keystrokeStats: KeystrokeStats) {
  const { project } = keystrokeStats;
  const increment = await updateFilesChangeSummary(keystrokeStats);
  await updateProjectSummary(project, increment);
  await updateUserSummary(increment);
  refreshViews();
}

export async function processData(keystrokeStats: KeystrokeStats) {
  logIt('[data][processData] run');
  await checkMidnight();
  await Promise.all([saveDataToDisk, appendKeystrokesPayload].map(async (fn) => {
    await fn(keystrokeStats);
  }));
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
        window.showErrorMessage('Generate dashborad got error:', e);
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
