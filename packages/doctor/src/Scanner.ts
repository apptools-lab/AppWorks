import * as path from 'path';
import { IScannerOptions, IScanOptions, IFileInfo, IScannerReports } from './types/Scanner';
import getCustomESLintConfig from './getCustomESLintConfig';
import getESLintReports from './getESLintReports';
import getMaintainabilityReports from './getMaintainabilityReports';
import getRepeatabilityReports from './getRepeatabilityReports';
import getFiles from './getFiles';
import getFinalScore from './getFinalScore';


export default class Scanner {
  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  // Entry
  public async scan(directory: string, options?: IScanOptions): Promise<IScannerReports> {
    const reports = {} as IScannerReports;

    const files: IFileInfo[] = getFiles(directory, this.options.supportExts, this.options.ignore);

    // Process package.json file.
    const packageFileInfo = getFiles(path.join(directory, 'package.json'), ['json'])[0];
    if (packageFileInfo) {
      files.push(packageFileInfo);
    }

    // Set files info
    reports.filesInfo = {
      count: files.length,
      lines: files.reduce((total, file) => total + file.LoC, 0),
    };

    // Calculate ESLint
    if (!options || options.disableESLint !== true) {
      // Example: react react-ts rax rax-ts
      const ruleKey = `${this.options.framework}${this.options.languageType === 'ts' ? '-ts' : ''}`;
      reports.ESLint = getESLintReports(files, ruleKey, getCustomESLintConfig(directory), options && options.fix);
    }

    // Calculate maintainability
    if (!options || options.disableMaintainability !== true) {
      reports.maintainability = getMaintainabilityReports(files);
    }

    // Calculate repeatability
    if (!options || options.disableRepeatability !== true) {
      reports.repeatability = await getRepeatabilityReports(directory, this.options.supportExts, this.options.ignore);
    }

    // Calculate total score
    reports.score = getFinalScore(
      [
        (reports.ESLint || {}).score,
        (reports.maintainability || {}).score,
        (reports.repeatability || {}).score,
      ].filter((score) => !isNaN(score)),
    );

    return reports;
  }
}
