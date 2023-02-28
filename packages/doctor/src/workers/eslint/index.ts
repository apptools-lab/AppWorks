import * as fs from 'fs-extra';
import { join } from 'path';
import getESLintReports from './getESLintReports';
import config from '../../config';
import type { RuleKey } from '@applint/applint';

const [directory, tempFileDir, ruleKey, fix, eslintExtendsConfig = '[]'] = process.argv.slice(2);

async function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = await getESLintReports(directory, files, ruleKey as RuleKey, fix === 'true', JSON.parse(eslintExtendsConfig));

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.eslint), JSON.stringify(result));
}

run();
