import ProjectLint, { CodemodSeverity } from '@applint/applint/dist/projectLint';
import type { ProjectLintResult } from '@applint/applint/dist/projectLint';
import Scorer from '../../Scorer';
import { ICodemodReports } from '../../types/Scanner';

// level waring minus 2 point
const WARNING_WEIGHT = -2;
// level error minus 5 point
const ERROR_WEIGHT = -5;

export default async function getProjectLintReports(
  cwd: string,
  fix: boolean,
  transforms?: Record<string, number>,
): Promise<ICodemodReports> {
  let reports: ProjectLintResult = {};

  const scorer = new Scorer();
  const projectLint = new ProjectLint({ cwd, transforms });

  try {
    if (fix) {
      reports = await projectLint.fix();
    } else {
      reports = await projectLint.scan();
    }

    const { codemod: codemodReports = [] } = reports;
    codemodReports.forEach((codemodReport) => {
      if (codemodReport.severity === CodemodSeverity.warn) {
        scorer.plus(WARNING_WEIGHT);
      } else if (codemodReport.severity === CodemodSeverity.error) {
        scorer.plus(ERROR_WEIGHT);
      }
    });
  } catch (error) {
    console.log(error);
  }
  return {
    score: scorer.getScore(),
    // TODO: return all the reports but not only the codemod report
    reports: reports.codemod || [],
  };
}
