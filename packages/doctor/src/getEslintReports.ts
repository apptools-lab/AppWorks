import { CLIEngine } from 'eslint';
import { deepmerge, getESLintConfig } from '@iceworks/spec';
import Scorer from './Scorer';
import { IFileInfo, IEslintReports } from './types/Scanner';

// level waring minus 1 point
const WARNING_WEIGHT = 1;
// level error minus 3 point
const ERROR_WEIGHT = 3;
// bonus add 2 point
const BONUS_WEIGHT = 2;

export default function getBestPracticesReports(files: IFileInfo[], ruleKey: string, customConfig?, fix?: boolean): IEslintReports {
  let warningScore = 0;
  let errorScore = 0;

  const reports = [];

  const cliEngine = new CLIEngine({
    baseConfig: deepmerge(getESLintConfig(ruleKey), customConfig),
    cwd: __dirname,
    fix: !!fix,
    useEslintrc: false,
  });

  files.forEach((file) => {
    cliEngine.executeOnText(file.source, file.path).results.forEach((result) => {
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

      reports.push({
        ...result,
        filePath: file.path,
      });
    });
  });

  if (fix) {
    // output fixes to disk
    CLIEngine.outputFixes(cliEngine.executeOnFiles(files.map((file) => file.path)));
  }

  // calculate score
  reports.forEach((report) => {
    warningScore += report.warningCount * WARNING_WEIGHT;
    errorScore += report.errorCount * ERROR_WEIGHT;
  });

  const scorer = new Scorer();
  scorer.minus(warningScore);
  scorer.minus(errorScore);

  // Calculate bonus
  if (files[files.length - 1].path.endsWith('package.json')) {
    const packageInfo = JSON.parse(files[files.length - 1].source);
    // recommend-deps-fusion-design
    if (packageInfo.dependencies && packageInfo.dependencies['@alifd/next']) {
      scorer.plus(BONUS_WEIGHT);
    }
    // recommend-typescript
    // TODO
    if (packageInfo.dependencies && packageInfo.dependencies.typescript) {
      scorer.plus(BONUS_WEIGHT);
    }
  }

  return {
    score: scorer.getScore(),
    reports,
  };
}
