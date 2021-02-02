/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const getRepeatabilityReports = require('./getRepeatabilityReports');
const config = require('../../config').default;

const [directory, tempFileDir, ignore] = process.argv.slice(2)[0].split(' ');

async function run() {
  const result = await getRepeatabilityReports(directory, tempFileDir, ignore);
  fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.report.jscpd), JSON.stringify(result));
}

run();
