import * as fs from 'fs-extra';
import { join } from 'path';
import config from '../../config';

const [tempFileDir] = process.argv.slice(2)[0].split(' ');

function run() {
  const result = { score: 0, reports: [] };

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.escomplex), JSON.stringify(result));
}

run();
