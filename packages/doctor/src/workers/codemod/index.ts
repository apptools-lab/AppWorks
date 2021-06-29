import * as fs from 'fs-extra';
import { join } from 'path';
import getCodemodReports from './getCodemodReports';
import config from '../../config';

const [directory, tempFileDir, transforms] = process.argv.slice(2)[0].split(' ');

async function run() {
  const files = fs.readJSONSync(join(tempFileDir, config.tmpFiles.files));
  const result = await getCodemodReports(
    directory,
    files,
    transforms && transforms !== 'undefined' ? transforms.split(',') : [],
  );

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.codemod), JSON.stringify(result));
}

run();
