import { commands, window, ProgressLocation, workspace, ViewColumn } from 'vscode';
import { KeystrokeStats } from './keystrokeStats';
import { updateFilesChangeSummary } from '../storages/filesChange';
import { updateProjectSummary, generateProjectDashboard } from '../storages/project';
import { updateUserSummary, generateUserDashboard } from '../storages/user';
import { checkMidnight } from './walkClock';
import { Progress } from '../utils/progress';
import { recordSessionTime } from '../utils/recorder';

async function saveDataToDisk(keystrokeStats: KeystrokeStats, sessionSeconds: number) {
  const { project } = keystrokeStats;
  const newData = updateFilesChangeSummary(keystrokeStats);
  updateProjectSummary(project, sessionSeconds);
  updateUserSummary({ ...newData, sessionSeconds });

  commands.executeCommand('iceworks-time-master.refreshTimerTree');
  commands.executeCommand('iceworks-time-master.refreshTimerStatusBar');
}

export async function processData(keystrokeStats: KeystrokeStats) {
  const sessionSeconds = keystrokeStats.getSessionSeconds();
  await checkMidnight();
  saveDataToDisk(keystrokeStats, sessionSeconds);
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
      const filePath = await generateFn();
      const doc = await workspace.openTextDocument(filePath);
      await window.showTextDocument(doc, ViewColumn.One, false);
      progressMgr.done();
    },
  );
}

export function generateProjectSummaryDashboard() {
  setProgressToGenerateSummaryDashboard('Loading project summary...', generateProjectDashboard);
}

export function generateUserSummaryDashboard() {
  setProgressToGenerateSummaryDashboard('Loading summary...', generateUserDashboard);
}