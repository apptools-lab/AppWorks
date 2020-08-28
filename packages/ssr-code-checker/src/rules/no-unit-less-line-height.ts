import * as lineColumn from 'line-column';
import { IProblem } from '../types/Problem';

// no unit line-height like: line-height: 20;
const REG = /line-height:([\s\d]+);/g;
const RULE_NAME = 'no-unit-less-line-height';

export default function checker(code: string, uri: string): IProblem[] {
  const problems: IProblem[] = [];

  let matched: RegExpExecArray | null;
  // eslint-disable-next-line
  while ((matched = REG.exec(code)) !== null) {
    const value = matched[1];

    if (Number(value) > 5) {
      const startPositionInfo = lineColumn(code).fromIndex(matched.index);
      const endPositionInfo = lineColumn(code).fromIndex(matched.index + 'line-height: '.length + value.length);

      problems.push({
        uri,
        rule: RULE_NAME,
        range: {
          start: {
            line: startPositionInfo.line - 1,
            col: startPositionInfo.col - 1,
          },
          end: {
            line: endPositionInfo.line - 1,
            col: endPositionInfo.col - 1,
          },
        },
        source: matched[0],
      });
    }
  }
  return problems;
}
