import { CLIEngine } from 'eslint';
import Scorer from './Scorer';
import { IFileInfo, IALiEslintReports } from './types/Scanner';

const warningWeight = 0.3;
const errorWeight = 0.7;

// https://www.npmjs.com/package/eslint-config-ali
export default function getAliEslintReports(files: IFileInfo[], LoC: number): IALiEslintReports {
  let warningScore = 0;
  let errorScore = 0;

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

  reports.forEach((report) => {
    warningScore += report.warningCount * warningWeight;
    errorScore += report.errorCount * errorWeight;
  });

  const scorer = new Scorer();
  scorer.minus(warningScore);
  scorer.minus(errorScore);

  return {
    score: scorer.getScore(),
    reports
  }
}