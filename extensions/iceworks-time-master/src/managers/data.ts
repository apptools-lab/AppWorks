import { commands, window, ProgressLocation, workspace, ViewColumn } from 'vscode';
import { KeystrokeStats } from './keystrokeStats';
import { updateFilesChangeSummary } from '../storages/filesChange';
import { updateProjectSummary, generateProjectDashboard } from '../storages/project';
import { updateUserSummary, generateUserDashboard } from '../storages/user';
import { checkMidnight } from './walkClock';
import { Progress } from '../utils/progress';
import { recordSessionTime } from '../utils/recorder';

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
  recordSessionTime(keystrokeStats);
}

function setProgressToGenerateSummaryDashboard(title: string, generateFn: any) {
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

export function generateProjectSummaryDashboard() {
  setProgressToGenerateSummaryDashboard('Loading project summary...', generateProjectDashboard);
}

export function generateUserSummaryDashboard() {
  setProgressToGenerateSummaryDashboard('Loading summary...', generateUserDashboard);
}
