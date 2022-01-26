import * as fs from 'fs-extra';
import { join } from 'path';
import getStylelintReports from './getStylelintReports';
import config from '../../config';
import type { RuleKey } from '@applint/applint';

const [directory, tempFileDir, ruleKey, fix] = process.argv.slice(2);

async function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = await getStylelintReports(directory, files, ruleKey as RuleKey, fix === 'true');

  await fs.writeFile(join(tempFileDir, config.tmpFiles.report.stylelint), JSON.stringify(result));
}

run();
