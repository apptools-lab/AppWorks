import { KeystrokeStats, FileChange } from './keystrokeStats';
import { getFilesSummary, saveFilesSummary } from '../../storages/file';

const forIn = require('lodash.forin');

export { KeystrokeStatsRecorder } from './recorder';
export { KeystrokeStats, FileChange } from './keystrokeStats';
export async function updateFilesSummary(keystrokeStats: KeystrokeStats) {
  const { files } = keystrokeStats;
  let linesAdded = 0;
  let linesRemoved = 0;
  let keystrokes = 0;
  let sessionSeconds = 0;
  const filesSummary = await getFilesSummary();
  forIn(files, (fileChange: FileChange, fsPath: string) => {
    let fileSummary = filesSummary[fsPath];
    if (!fileSummary) {
      fileSummary = {
        ...fileChange,
        sessionSeconds: fileChange.durationSeconds,
        kpm: fileChange.keystrokes,
      };
    } else {
      // aggregate
      fileSummary.update += 1;
      fileSummary.open += fileChange.open;
      fileSummary.close += fileChange.close;
      fileSummary.keystrokes += fileChange.keystrokes;
      fileSummary.kpm = fileSummary.keystrokes / fileSummary.update;
      fileSummary.addTimes += fileChange.addTimes;
      fileSummary.deleteTimes += fileChange.deleteTimes;
      fileSummary.pasteTimes += fileChange.pasteTimes;
      fileSummary.keystrokes += fileChange.keystrokes;
      fileSummary.linesAdded += fileChange.linesAdded;
      fileSummary.linesRemoved += fileChange.linesRemoved;
      fileSummary.sessionSeconds += fileChange.durationSeconds;
      // non aggregates, just set
      fileSummary.lineCount = fileChange.lineCount;
      fileSummary.length = fileChange.length;
      fileSummary.end = fileChange.end;
    }
    keystrokes += fileChange.keystrokes;
    linesAdded += fileChange.linesAdded;
    linesRemoved += fileChange.linesRemoved;
    sessionSeconds += fileChange.durationSeconds;
    filesSummary[fsPath] = fileSummary;
  });
  await saveFilesSummary(filesSummary);
  return {
    linesAdded,
    linesRemoved,
    keystrokes,
    sessionSeconds,
  };
}
