import { KeystrokeStats } from '../keystrokeStats';
import { FileChange, getFilesChangeSummary, saveFilesChangeSummary } from '../storages/filesChange';
import { getProjectsSummary, saveProjectsSummary } from '../storages/project';
import { getUserSummary, saveUserSummary } from '../storages/user';
import forIn = require('lodash.forin');

export async function processPayload(keystrokeStats: KeystrokeStats) {
  const sessionSeconds = keystrokeStats.getSessionSeconds();
  saveDataToDisk(keystrokeStats, sessionSeconds);
}

export async function saveDataToDisk(keystrokeStats: KeystrokeStats, sessionSeconds: number) {
  const { files, project } = keystrokeStats;
  let linesAdded = 0;
  let linesRemoved = 0;
  let keystrokes = 0;

  // update filesChangeSummary
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
  });
  saveFilesChangeSummary(filesChangeSummary);

  // update projectSummary
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
  saveProjectsSummary(projectsSummary);

  // update userSummary
  const userSummary = getUserSummary();
  userSummary.linesAdded += linesAdded;
  userSummary.linesRemoved += linesRemoved;
  userSummary.keystrokes += keystrokes;
  saveUserSummary(userSummary);
}

export async function sendDataToServer() {
  // TODO
}