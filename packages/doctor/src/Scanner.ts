import * as fs from 'fs-extra';
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

    const files: IFileInfo[] = getFiles(directory, this.options.ignore);

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
        if (fs.existsSync(path.join(directory, './tsconfig.json'))) {
          customConfig.parserOptions.project = path.join(directory, './tsconfig.json');
        }
      }
      reports.ESLint = getEslintReports(directory, timer, files, ruleKey, customConfig, options?.fix);
    }

    // Calculate maintainability
    if (!options || options.disableMaintainability !== true) {
      reports.maintainability = getMaintainabilityReports(timer, files);
    }

    // Calculate repeatability
    if (!options || options.disableRepeatability !== true) {
      reports.repeatability = await getRepeatabilityReports(directory, this.options.ignore, options?.tempFileDir);
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
