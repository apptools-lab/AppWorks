import * as fs from 'fs-extra';
import { join } from 'path';
import getEslintReports from './getESLintReports';
import config from '../../config';

const [directory, tempFileDir, ruleKey, fix] = process.argv.slice(2);

async function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = await getEslintReports(directory, files, ruleKey, fix === 'true');

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.eslint), JSON.stringify(result));
}

run();
