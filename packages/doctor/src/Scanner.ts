import * as fs from 'fs-extra';
import * as path from 'path';
import Scorer from './Scorer';
import { IScannerOptions, IScanOptions, IFileInfo, IScannerReports } from './types/Scanner';
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
    const reports = {} as IScannerReports;

    const files: IFileInfo[] = getFiles(directory, this.options.supportExts, this.options.ignore);
    
    // Calculate Ali eslint
    if (!options || options.disableAliEslint !== true) {
      reports.aliEslint = getEslintReports(
        'eslint-config-ali',
        0.3, // level waring minus 0.3 point
        0.7, // level error minus 0.7 point
        files,
        options && options.fix
      );
    }

    // Ali eslint don't check package.json.
    // Process package.json file after Ali eslint calculate.
    let packageObj;
    const packageFileInfo = getFiles(path.join(directory, 'package.json'), ['json'])[0];
    if (packageFileInfo) {
      packageObj = fs.readJSONSync(packageFileInfo.path);
      files.push(packageFileInfo);
    }


    // Set files info
    reports.filesInfo = {
      count: files.length,
      lines: files.reduce((total, file) => total + file.LoC, 0),
    };

    // Calculate best practices
    if (!options || options.disableBestPractices !== true) {
      reports.bestPractices = getEslintReports(
        'plugin:@iceworks/best-practices/recommended',
        1, // level waring minus 1 point
        3, // level error minus 3 point
        files,
        options && options.fix
      );

      // Calculate bonus
      const bonus = 2;
      if (packageObj) {
        const bestPracticesScore = new Scorer({ start: reports.bestPractices.score });
        // recommend-deps-fusion-design
        if (packageObj.dependencies && packageObj.dependencies['@alifd/next']) {
          bestPracticesScore.plus(bonus);
        }
        // recommend-typescript
        if (packageObj.dependencies && packageObj.dependencies.typescript) {
          bestPracticesScore.plus(bonus);
        }
        // recommend-eslint-config-rax
        if (packageObj.devDependencies && packageObj.devDependencies['eslint-config-rax']) {
          bestPracticesScore.plus(bonus);
        }

        reports.bestPractices.score = bestPracticesScore.getScore();
      }
    }

    // Calculate security practices
    if (!options || options.disableSecurityPractices !== true) {
      reports.securityPractices = getEslintReports(
        'plugin:@iceworks/security-practices/recommended',
        1, // level waring minus 1 point
        5, // level error minus 5 point
        files,
        options && options.fix
      );
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
        (reports.aliEslint || {}).score,
        (reports.bestPractices || {}).score,
        (reports.securityPractices || {}).score,
        (reports.maintainability || {}).score,
        (reports.repeatability || {}).score,
      ].filter((score) => !isNaN(score))
    );

    return reports;
  }
}
