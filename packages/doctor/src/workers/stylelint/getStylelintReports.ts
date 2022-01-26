import Scorer from '../../Scorer';
import { IFileInfo } from '../../types/File';
import { Stylelint, RuleKey } from '@applint/applint';
import { IStylelintReports } from '../../types/Scanner';

// level waring minus 1 point
const WARNING_WEIGHT = -3;

async function getStylelintReports(
  directory: string,
  files: IFileInfo[],
  ruleKey: RuleKey,
  fix: boolean,
): Promise<IStylelintReports> {
  const stylelint = new Stylelint({ directory, ruleKey, files });

  let stylelintResult;
  if (fix) {
    stylelintResult = await stylelint.fix();
  } else {
    stylelintResult = await stylelint.scan();
  }
  const { data, customConfig } = stylelintResult;

  const reports = data.results.filter((result) => result.parseErrors.length === 0);
  const warningCount = reports.length;
  const warningScore = warningCount * WARNING_WEIGHT;

  const scorer = new Scorer();
  scorer.plus(warningScore);

  return {
    score: scorer.getScore(),
    reports,
    warningCount,
    customConfig,
  };
}

export default getStylelintReports;
