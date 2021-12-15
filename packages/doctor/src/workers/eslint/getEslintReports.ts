import Scorer from '../../Scorer';
import { IEslintReports } from '../../types/Scanner';
import { IFileInfo } from '../../types/File';
import { ESLint } from '@applint/applint';

// level waring minus 1 point
const WARNING_WEIGHT = -1;
// level error minus 3 point
const ERROR_WEIGHT = -3;
// bonus add 2 point
const BONUS_WEIGHT = 2;

export default async function getEslintReports(directory: string, files: IFileInfo[], ruleKey: string, fix: boolean): Promise<IEslintReports> {
  let warningScore = 0;
  let warningCount = 0;

  let errorScore = 0;
  let errorCount = 0;

  // package.json object
  const packageInfo: any = getPackageInfo(files);

  const reports = [];
  let ESLintResult = {} as any;

  const eslint = new ESLint({ directory, ruleKey, files });
  if (fix) {
    ESLintResult = await eslint.fix();
  } else {
    ESLintResult = await eslint.scan();
  }

  const { data: results, customConfig } = ESLintResult;
  (results || []).forEach((result) => {
    // Remove Parsing error
    result.messages = (result.messages || []).filter((message) => {
      if (
        message.severity === 2 && (
          // Ignore Parsing error
          (message.fatal && message.message.startsWith('Parsing error:')) ||
          // Ignore no rules error
          message.message.startsWith('Definition for rule')
        )) {
        result.errorCount--;
        return false;
      }
      return true;
    });

    reports.push(result);
  });

  // calculate score
  reports.forEach((report) => {
    // Add critical level calculate.
    (report.messages || []).forEach((message) => {
      if (message.message.indexOf('[Critical]') === 0) {
        if (message.severity === 2) {
          // Critical error
          errorScore += ERROR_WEIGHT;
        } else {
          // Critical warning
          warningScore += WARNING_WEIGHT;
        }
      }
    });
    warningCount += report.warningCount;
    warningScore += report.warningCount * WARNING_WEIGHT;
    errorCount += report.errorCount;
    errorScore += report.errorCount * ERROR_WEIGHT;
  });

  const scorer = new Scorer();
  scorer.plus(warningScore);
  scorer.plus(errorScore);

  // Calculate bonus
  // recommend-deps-fusion-design
  if (packageInfo.dependencies && packageInfo.dependencies['@alifd/next']) {
    scorer.plus(BONUS_WEIGHT);
  }
  // recommend-typescript
  if (packageInfo.devDependencies && packageInfo.devDependencies.typescript) {
    scorer.plus(BONUS_WEIGHT);
  }

  return {
    score: scorer.getScore(),
    reports,
    errorCount,
    warningCount,
    customConfig,
  };
}

function getPackageInfo(files: IFileInfo[]) {
  const packageJSONFile = files.find((file: IFileInfo) => {
    return file.path.endsWith('package.json');
  });
  if (packageJSONFile) {
    return JSON.parse(packageJSONFile.source);
  }

  return {};
}
