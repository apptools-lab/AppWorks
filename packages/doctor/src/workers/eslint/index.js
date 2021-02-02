/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const getEslintReports = require('./getEslintReports');
const config = require('../../config').default;

const [directory, tempFileDir, ruleKey, fix] = process.argv.slice(2)[0].split(' ');

function run() {
  const files = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.files));
  const result = getEslintReports(directory, files, ruleKey, fix);

  fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.report.eslint), JSON.stringify(result));
}

run();
