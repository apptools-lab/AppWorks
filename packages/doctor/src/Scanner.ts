import { IScannerOptions, IFileInfo, IScannerReports } from './types/Scanner';
import getAliEslintReports from './getAliEslintReports';
import getMaintainabilityReports from './getMaintainabilityReports';
import getRepeatabilityReports from './getRepeatabilityReports';
import getFiles from './getFiles';

export default class Scanner {

  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  // Entry
  public async scan(directory: string): Promise<IScannerReports> {

    const reports = {} as IScannerReports;

    try {
      const files = getFiles(directory, this.options.supportExts, this.options.ignoreDirs);
      const totalLoc = files.reduce((total, file) => { return total + file.LoC }, 0);

      reports.filesInfo = {
        count: files.length,
        lines: totalLoc
      }

      // Calculate Ali eslint 
      reports.aliEslint = getAliEslintReports(files, totalLoc);
      // Calculate maintainability
      reports.maintainability = getMaintainabilityReports(files);
      // Calculate repeatability
      reports.repeatability = await getRepeatabilityReports(directory, this.options.supportExts, this.options.ignoreDirs);

    } catch (error) {
      // ignore
    }

    return reports;
  }
}
