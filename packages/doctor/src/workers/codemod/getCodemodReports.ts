
import { check, run, IResult } from '@appworks/codemod';
import Scorer from '../../Scorer';
import { ICodemodReports } from '../../types/Scanner';
import { IFileInfo } from '../../types/File';

// level waring minus 2 point
const WARNING_WEIGHT = -2;
// level error minus 5 point
const ERROR_WEIGHT = -5;

export default async function getCodemodReports(directory: string, files: IFileInfo[], transforms: string[]): Promise<ICodemodReports> {
  let reports: IResult[] = [];
  const runResults: IResult[] = [];

  const scorer = new Scorer();
  const filesPathArr = files.map((file) => file.path);

  try {
    // Run codemod first
    for (let i = 0, l = transforms.length; i < l; i++) {
      runResults.push(await run(directory, filesPathArr, transforms[i]));
    }

    // Check recommended codemod
    reports = await check(directory, filesPathArr);

    reports.forEach((report) => {
      if (report.severity === 1) {
        scorer.plus(WARNING_WEIGHT);
      } else if (report.severity === 2) {
        scorer.plus(ERROR_WEIGHT);
      }
    });

    // concat `run` results
    reports = reports.concat(runResults);
  } catch (e) {
    // ignore
    console.log(e);
  }

  return {
    score: scorer.getScore(),
    reports,
  };
}
