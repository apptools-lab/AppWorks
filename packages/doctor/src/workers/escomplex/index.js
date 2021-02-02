/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const getMaintainabilityReports = require('./getMaintainabilityReports');
const config = require('../../config').default;

const [tempFileDir] = process.argv.slice(2)[0].split(' ');

function run() {
  const files = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.files));
  const result = getMaintainabilityReports(files);

  fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.report.escomplex), JSON.stringify(result));
}

run();
