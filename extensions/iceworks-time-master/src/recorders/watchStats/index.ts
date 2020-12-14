import { WatchStats, FileWatch } from './watchStats';
import { getFilesSummary, saveFilesSummary } from '../../storages/file';

const forIn = require('lodash.forin');

export { WatchStatsRecorder } from './recorder';
export { WatchStats, FileWatch } from './watchStats';

export async function updateFilesSummary(watchStats: WatchStats) {
  const { files } = watchStats;
  let editorSeconds = 0;
  const filesSummary = await getFilesSummary();
  forIn(files, (fileWatch: FileWatch, fsPath: string) => {
    let fileSummary = filesSummary[fsPath];
    if (!fileSummary) {
      // TODO
      // @ts-ignore
      fileSummary = {
        ...fileWatch,
        sessionSeconds: fileWatch.durationSeconds,
      };
    } else {
      // aggregate
      fileSummary.sessionSeconds += fileWatch.durationSeconds;
    }
    editorSeconds += fileWatch.durationSeconds;
    filesSummary[fsPath] = fileSummary;
  });
  await saveFilesSummary(filesSummary);
  return {
    editorSeconds,
  };
}
