// import * as fs from 'fs-extra';
// import { join } from 'path';
// import getCodemodReports from './getCodemodReports';
// import config from '../../config';

// const [directory, tempFileDir, transforms, fix] = process.argv.slice(2)[0].split(' ');

// async function run() {
//   const result = await getCodemodReports(
//     directory,
//     (transforms && transforms !== 'undefined') ? JSON.parse(transforms) : {},
//     !(fix === 'true'),
//   );

//   fs.writeFileSync(join(tempFileDir, config.tmpFiles.report.codemod), JSON.stringify(result));
// }

// run();
