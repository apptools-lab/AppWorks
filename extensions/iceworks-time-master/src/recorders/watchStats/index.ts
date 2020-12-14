import { WatchStats, FileWatch } from './watchStats';
import { getFilesSummary, saveFilesSummary, getFileSummaryDefaults } from '../../storages/file';

const forIn = require('lodash.forin');

export { WatchStatsRecorder } from './recorder';
export { WatchStats, FileWatch } from './watchStats';

export async function updateFilesSummary(watchStats: WatchStats) {
  const { files } = watchStats;
  let editorSeconds = 0;
  const filesSummary = await getFilesSummary();
  const defaultValues = getFileSummaryDefaults();
  forIn(files, (fileWatch: FileWatch, fsPath: string) => {
    let fileSummary = filesSummary[fsPath];
    if (!fileSummary) {
      fileSummary = {
        ...defaultValues,
        ...fileWatch,
        startWatch: fileWatch.start,
        endWatch: fileWatch.end,
        editorSeconds: fileWatch.durationSeconds,
      };
    } else {
      // aggregate
      fileSummary.editorSeconds += fileWatch.durationSeconds;
      fileSummary.endWatch += fileWatch.end;
    }
    editorSeconds += fileWatch.durationSeconds;
    filesSummary[fsPath] = fileSummary;
  });
  await saveFilesSummary(filesSummary);
  return {
    editorSeconds,
  };
}
