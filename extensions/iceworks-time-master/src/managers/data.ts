import { commands } from 'vscode';
import { KeystrokeStats } from '../keystrokeStats';
import { FileChange, getFilesChangeSummary, saveFilesChangeSummary } from '../storages/filesChange';
import { getProjectsSummary, Project, saveProjectsSummary } from '../storages/project';
import { getUserSummary, saveUserSummary, UserSummary } from '../storages/user';
import { logIt } from '../utils/common';
import forIn = require('lodash.forin');

export async function processPayload(keystrokeStats: KeystrokeStats) {
  const sessionSeconds = keystrokeStats.getSessionSeconds();
  saveDataToDisk(keystrokeStats, sessionSeconds);

  commands.executeCommand('iceworks-time-master.refreshTimerTree');
}

function updateFilesChangeSummary(keystrokeStats: KeystrokeStats) {
  const { files } = keystrokeStats;
  let linesAdded = 0;
  let linesRemoved = 0;
  let keystrokes = 0;
  const filesChangeSummary = getFilesChangeSummary();
  forIn(files, (fileChange: FileChange, fsPath: string) => {
    let fileChangeSummary = filesChangeSummary[fsPath];
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
  logIt('[dataManager]projectSummary', projectSummary);
  saveProjectsSummary(projectsSummary);
}

function updateUserSummary(user: UserSummary) {
  const { linesAdded, linesRemoved, keystrokes, sessionSeconds } = user;
  const userSummary = getUserSummary();
  userSummary.sessionSeconds += sessionSeconds;
  userSummary.linesAdded += linesAdded;
  userSummary.linesRemoved += linesRemoved;
  userSummary.keystrokes += keystrokes;
  logIt('[dataManager]userSummary', userSummary);
  saveUserSummary(userSummary);
}

export async function saveDataToDisk(keystrokeStats: KeystrokeStats, sessionSeconds: number) {
  const { project } = keystrokeStats;
  const newData = updateFilesChangeSummary(keystrokeStats);
  updateProjectSummary(project, sessionSeconds);
  updateUserSummary({ ...newData, sessionSeconds });
}

export async function sendDataToServer() {
  // TODO
}