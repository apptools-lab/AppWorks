import * as fs from 'fs-extra';
import { join } from 'path';
import getMaintainabilityReports from './getMaintainabilityReports';
import config from '../../config';

const [tempFileDir] = process.argv.slice(2)[0].split(' ');

function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = getMaintainabilityReports(files);

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.escomplex), JSON.stringify(result));
}

run();
