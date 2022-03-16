import * as fs from 'fs-extra';
import { join } from 'path';
import getProjectLintReports from './getProjectLintReports';
import config from '../../config';

const [directory, tempFileDir, transforms, fix, customTransformRules] = process.argv.slice(2);

async function run() {
  const result = await getProjectLintReports(
    directory,
    (fix === 'true'),
    (transforms && transforms !== 'undefined') ? JSON.parse(transforms) : undefined,
    (customTransformRules && customTransformRules !== 'undefined') ? JSON.parse(customTransformRules) : undefined,
  );

  fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.codemod), JSON.stringify(result));
}

run();
