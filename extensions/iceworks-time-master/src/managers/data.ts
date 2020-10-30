import { commands } from 'vscode';
import { KeystrokeStats } from '../keystrokeStats';
import { FileChange, getFilesChangeSummary, saveFilesChangeSummary } from '../storages/filesChange';
import { getProjectsSummary, Project, saveProjectsSummary } from '../storages/project';
import { getUserSummary, saveUserSummary, UserSummary } from '../storages/user';
import { logIt } from '../utils/common';
import { checkMidnight } from './walkClock';
import forIn = require('lodash.forin');

function updateFilesChangeSummary(keystrokeStats: KeystrokeStats) {
  const { files } = keystrokeStats;
  let linesAdded = 0;
  let linesRemoved = 0;
  let keystrokes = 0;
  const filesChangeSummary = getFilesChangeSummary();
  forIn(files, (fileChange: FileChange, fsPath: string) => {
    let fileChangeSummary = filesChangeSummary[fsPath];
    fileChange.durationSeconds = fileChange.end - fileChange.start;
    if (!fileChangeSummary) {
      fileChange.update = 1;
      fileChange.kpm = fileChange.keystrokes;
      fileChangeSummary = { ...fileChange, sessionSeconds: fileChange.durationSeconds };
    } else {
      // aggregate
      fileChangeSummary.update += 1;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.kpm = fileChangeSummary.keystrokes / fileChangeSummary.update;
      fileChangeSummary.add += fileChange.add;
      fileChangeSummary.close += fileChange.close;
      fileChangeSummary.delete += fileChange.delete;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.linesAdded += fileChange.linesAdded;
      fileChangeSummary.linesRemoved += fileChange.linesRemoved;
      fileChangeSummary.open += fileChange.open;
      fileChangeSummary.paste += fileChange.paste;
      fileChangeSummary.sessionSeconds += fileChange.durationSeconds;
      // non aggregates, just set
      fileChangeSummary.lineCount = fileChange.lineCount;
      fileChangeSummary.length = fileChange.length;
      fileChangeSummary.end = fileChange.end;
    }

    linesAdded += fileChangeSummary.linesAdded;
    linesRemoved += fileChangeSummary.linesRemoved;
    keystrokes += fileChangeSummary.keystrokes;
    filesChangeSummary[fsPath] = fileChangeSummary;
    logIt(`[dataManager]fileChangeSummary[${fsPath}]`, fileChangeSummary);
  });
  saveFilesChangeSummary(filesChangeSummary);
  return {
    linesAdded,
    linesRemoved,
    keystrokes,
  };
}

function updateProjectSummary(project: Project, sessionSeconds: number) {
  const projectsSummary = getProjectsSummary();
  const { directory } = project;
  let projectSummary = projectsSummary[directory];
  if (!projectSummary) {
    projectSummary = {
      ...project,
      sessionSeconds,
      editorSeconds: sessionSeconds,
    };
  } else {
    Object.assign(
      projectSummary,
      project,
    );
    projectSummary.sessionSeconds += sessionSeconds;
    projectSummary.editorSeconds = Math.max(
      projectSummary.editorSeconds,
      projectSummary.sessionSeconds,
    );
  }
  projectsSummary[directory] = projectSummary;
  logIt('[dataManager]projectSummary', projectSummary);
  saveProjectsSummary(projectsSummary);
}

function updateUserSummary(user: UserSummary) {
  const { linesAdded, linesRemoved, keystrokes, sessionSeconds = 0, editorSeconds = 0 } = user;
  const userSummary = getUserSummary();
  userSummary.sessionSeconds += sessionSeconds;
  userSummary.editorSeconds += editorSeconds;
  userSummary.editorSeconds = Math.max(
    userSummary.editorSeconds,
    userSummary.sessionSeconds,
  );
  userSummary.linesAdded += linesAdded;
  userSummary.linesRemoved += linesRemoved;
  userSummary.keystrokes += keystrokes;
  logIt('[dataManager]userSummary', userSummary);
  saveUserSummary(userSummary);
}

async function saveDataToDisk(keystrokeStats: KeystrokeStats, sessionSeconds: number) {
  const { project } = keystrokeStats;
  const newData = updateFilesChangeSummary(keystrokeStats);
  updateProjectSummary(project, sessionSeconds);
  updateUserSummary({ ...newData, sessionSeconds });

  commands.executeCommand('iceworks-time-master.refreshTimerTree');
}

async function sendDataToServer() {
  // TODO
}

export async function processPayload(keystrokeStats: KeystrokeStats) {
  checkMidnight();
  const sessionSeconds = keystrokeStats.getSessionSeconds();
  saveDataToDisk(keystrokeStats, sessionSeconds);
  sendDataToServer();
}
