
import { runTransforms, TransformResult, Severity } from '@applint/projectlint';
import Scorer from '../../Scorer';
import { ICodemodReports } from '../../types/Scanner';

// level waring minus 2 point
const WARNING_WEIGHT = -2;
// level error minus 5 point
const ERROR_WEIGHT = -5;

export default async function getCodemodReports(directory: string, transforms: Record<string, Severity>, dry = true): Promise<ICodemodReports> {
  let reports: TransformResult[] = [];

  const scorer = new Scorer();

  try {
    reports = await runTransforms({ cwd: directory, transforms, dry });

    reports.forEach((report) => {
      if (report.severity === Severity.warn) {
        scorer.plus(WARNING_WEIGHT);
      } else if (report.severity === Severity.error) {
        scorer.plus(ERROR_WEIGHT);
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    score: scorer.getScore(),
    reports,
  };
}
