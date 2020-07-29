import * as fs from 'fs-extra';
import { CLIEngine } from 'eslint';
import { IScannerOptions, IFileInfo, IScannerReports } from './types/Scanner';
import getMaintainabilityReports from './getMaintainabilityReports';
import getRepeatabilityReports from './getRepeatabilityReports';
import getFiles from './getFiles';

export default class Scanner {

  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  // https://www.npmjs.com/package/eslint-config-ali
  private getAliEslintReports(files: IFileInfo[]) {
    const reports = [];
    const aliEslintCliEngine = new CLIEngine({
      baseConfig: {
        extends: 'eslint-config-ali'
      },
      useEslintrc: false
    });

    files.forEach(file => {
      aliEslintCliEngine.executeOnText(file.source).results.forEach((result) => {
        reports.push({
          ...result,
          filePath: file.path
        });
      })
    });
    console.log(reports[0]);
    console.log(reports.length);
  }

  // Entry
  public async scan(directory: string): Promise<IScannerReports> {

    const reports = {} as IScannerReports;

    try {
      const files = getFiles(directory, this.options.supportExts, this.options.ignoreDirs);

      reports.filesInfo = {
        count: files.length,
        lines: files.reduce((total, file) => { return total + file.LOC }, 0)
      }

      // Calculate Ali eslint 
      this.getAliEslintReports(files);

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
