import { commands, window, ProgressLocation, workspace, ViewColumn } from 'vscode';
import { KeystrokeStats } from './keystrokeStats';
import { updateFilesChangeSummary } from '../storages/filesChange';
import { updateProjectSummary, generateProjectReport } from '../storages/project';
import { updateUserSummary, generateUserReport } from '../storages/user';
import { checkMidnight } from './walkClock';
import { Progress } from '../utils/progress';
import { appendSessionTimePayload } from '../utils/sender';

async function saveDataToDisk(keystrokeStats: KeystrokeStats) {
  const { project } = keystrokeStats;
  const increment = await updateFilesChangeSummary(keystrokeStats);
  await updateProjectSummary(project, increment);
  await updateUserSummary(increment);

  commands.executeCommand('iceworks-time-master.refreshTimerTree');
  commands.executeCommand('iceworks-time-master.refreshTimerStatusBar');
}

export async function processData(keystrokeStats: KeystrokeStats) {
  await checkMidnight();
  saveDataToDisk(keystrokeStats);
  appendSessionTimePayload(keystrokeStats);
}

function setProgressToGenerateSummaryReport(title: string, generateFn: any) {
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
