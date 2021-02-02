import * as fs from 'fs-extra';
import { join } from 'path';
import getEslintReports from './getEslintReports';
import config from '../../config';

const [directory, tempFileDir, ruleKey, fix] = process.argv.slice(2)[0].split(' ');

function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = getEslintReports(directory, files, ruleKey, fix);

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.eslint), JSON.stringify(result));
}

run();
