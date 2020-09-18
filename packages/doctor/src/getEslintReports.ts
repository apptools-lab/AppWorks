import { CLIEngine } from 'eslint';
import Scorer from './Scorer';
import { IFileInfo, IEslintReports } from './types/Scanner';

export default function getBestPracticesReports(
  extendsConfigName: string,
  warningWeight: number,
  errorWeight: number,
  files: IFileInfo[],
  fix?: boolean,
): IEslintReports {
  let warningScore = 0;
  let errorScore = 0;

  const reports = [];

  const aliEslintCliEngine = new CLIEngine({
    baseConfig: {
      extends: extendsConfigName,
    },
    cwd: __dirname,
    fix: !!fix,
    useEslintrc: false,
  });

  files.forEach((file) => {
    aliEslintCliEngine.executeOnText(file.source, file.path).results.forEach((result) => {
      // Remove Parsing error
      result.messages = (result.messages || []).filter((message) => {
        if (message.fatal && message.severity === 2 && message.message.startsWith('Parsing error:')) {
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
    CLIEngine.outputFixes(aliEslintCliEngine.executeOnFiles(files.map((file) => file.path)));
  }

  reports.forEach((report) => {
    warningScore += report.warningCount * warningWeight;
    errorScore += report.errorCount * errorWeight;
  });

  const scorer = new Scorer();
  scorer.minus(warningScore);
  scorer.minus(errorScore);

  return {
    score: scorer.getScore(),
    reports,
  };
}
