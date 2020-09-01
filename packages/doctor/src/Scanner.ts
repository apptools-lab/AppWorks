import * as fs from 'fs-extra';
import * as path from 'path';
import Scorer from './Scorer';
import { IScannerOptions, IFileInfo, IScannerReports } from './types/Scanner';
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
  public async scan(directory: string): Promise<IScannerReports> {
    const reports = {} as IScannerReports;

    try {
      const files: IFileInfo[] = getFiles(directory, this.options.supportExts, this.options.ignoreDirs);
      const totalLoc = files.reduce((total, file) => {
        return total + file.LoC;
      }, 0);

      reports.filesInfo = {
        count: files.length,
        lines: totalLoc,
      };

      // Calculate Ali eslint
      // level waring minus 0.3 point
      // level error minus 0.7 point
      reports.aliEslint = getEslintReports('eslint-config-ali', 0.3, 0.7, files);

      // Process package.json file
      let packageObj;
      const packageFile = path.join(directory, 'package.json');
      if (fs.existsSync(packageFile)) {
        packageObj = fs.readJSONSync(packageFile);
        const packageSource = fs.readFileSync(packageFile, 'utf-8');
        files.push({
          path: packageFile,
          source: packageSource,
          // lines of code
          LoC: (packageSource.match(/\n/g) || '').length + 1,
        });
      }

      // Calculate best practices
      // level waring minus 1 point
      // level error minus 3 point
      reports.bestPractices = getEslintReports('plugin:@iceworks/best-practices/recommended', 1, 3, files);

      // Calculate security practices
      // level waring minus 1 point
      // level error minus 5 point
      reports.securityPractices = getEslintReports('plugin:@iceworks/security-practices/recommended', 1, 5, files);

      // Calculate maintainability
      reports.maintainability = getMaintainabilityReports(files);
      // Calculate repeatability
      reports.repeatability = await getRepeatabilityReports(
        directory,
        this.options.supportExts,
        this.options.ignoreDirs
      );

      // Calculate bonus
      const bonus = 2;
      if (packageObj) {
        const bestPracticesScore = new Scorer({ start: reports.bestPractices.score });
        // recommend-deps-fusion-design
        if (packageObj.dependencies['@alifd/next']) {
          bestPracticesScore.plus(bonus);
        }
        // recommend-typescript
        if (packageObj.devDependencies['typescript']) {
          bestPracticesScore.plus(bonus);
        }
        // recommend-eslint-config-rax
        if (packageObj.devDependencies['eslint-config-rax']) {
          bestPracticesScore.plus(bonus);
        }

        reports.bestPractices.score = bestPracticesScore.getScore();
      }

      // Calculate total score
      reports.score = getFinalScore([
        reports.aliEslint.score,
        reports.bestPractices.score,
        reports.securityPractices.score,
        reports.maintainability.score,
        reports.repeatability.score,
      ]);
    } catch (error) {
      // ignore
      console.log(error);
    }

    return reports;
  }
}
