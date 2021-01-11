import { UsageStats, FileUsage } from './usageStats';
import { getFilesSummary, saveFilesSummary, getFileSummaryDefaults } from '../../storages/file';

const forIn = require('lodash.forin');

export * from './recorder';
export * from './usageStats';
export async function updateFilesSummary(usageStats: UsageStats) {
  const { files } = usageStats;
  let editorSeconds = 0;
  const filesSummary = await getFilesSummary();
  const defaultValues = getFileSummaryDefaults();
  forIn(files, (fileUsage: FileUsage, fsPath: string) => {
    let fileSummary = filesSummary[fsPath];
    if (!fileSummary) {
      fileSummary = {
        ...defaultValues,
        ...fileUsage,
        startUsage: fileUsage.start,
        endUsage: fileUsage.end,
        editorSeconds: fileUsage.durationSeconds,
      };
    } else {
      // aggregate
      fileSummary.editorSeconds += fileUsage.durationSeconds;
      fileSummary.endUsage += fileUsage.end;
    }
    editorSeconds += fileUsage.durationSeconds;
    filesSummary[fsPath] = fileSummary;
  });
  await saveFilesSummary(filesSummary);
  return {
    editorSeconds,
  };
}
