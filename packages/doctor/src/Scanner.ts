import * as path from 'path';
import Timer from './Timer';
import { IScannerOptions, IScanOptions, IScannerReports } from './types/Scanner';
import { IFileInfo } from './types/File';
import getCustomESLintConfig from './getCustomESLintConfig';
import getEslintReports from './getEslintReports';
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
    const timer = new Timer(options?.timeout);
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
      const ruleKey = `${options?.framework || 'react'}${options?.languageType === 'ts' ? '-ts' : ''}`;
      const customConfig: any = getCustomESLintConfig(directory) || {};
      if (options?.languageType === 'ts') {
        if (!customConfig.parserOptions) {
          customConfig.parserOptions = {};
        }
        customConfig.parserOptions.project = `${path.join(directory, './')}**/tsconfig.json`;
      }
      reports.ESLint = getEslintReports(timer, files, ruleKey, customConfig, options?.fix);
    }

    // Calculate maintainability
    if (!options || options.disableMaintainability !== true) {
      reports.maintainability = getMaintainabilityReports(timer, files);
    }

    // Calculate repeatability
    if (!options || options.disableRepeatability !== true) {
      reports.repeatability = await getRepeatabilityReports(directory, this.options.supportExts, this.options.ignore, options?.tempFileDir);
    }

    // Calculate total score
    reports.score = getFinalScore(
      [
        (reports.ESLint || {}).score,
        (reports.maintainability || {}).score,
        (reports.repeatability || {}).score,
      ].filter((score) => !isNaN(score)),
    );

    // Duration seconds
    reports.scanTime = timer.duration();

    return reports;
  }
}
