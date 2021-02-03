import * as fs from 'fs-extra';
import { join } from 'path';
import getRepeatabilityReports from './getRepeatabilityReports';
import config from '../../config';

const [directory, tempFileDir, ignore] = process.argv.slice(2)[0].split(' ');

async function run() {
  const result = await getRepeatabilityReports(directory, tempFileDir, ignore);
  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.jscpd), JSON.stringify(result));
}

run();
