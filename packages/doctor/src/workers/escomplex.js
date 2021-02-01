/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const escomplex = require('typhonjs-escomplex');
const config = require('../config').default;
const Scorer = require('../Scorer').default;

const SUPPORT_FILE_REG = /(\.js|\.jsx|\.ts|\.tsx|\.vue)$/;

const [tempFileDir] = process.argv.slice(2)[0].split(' ');
getMaintainabilityReports();

// https://www.npmjs.com/package/typhonjs-escomplex
function getMaintainabilityReports() {
  const reports = [];
  const files = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.files));
  files.forEach((file) => {
    if (!SUPPORT_FILE_REG.test(file.path)) return;

    try {
      reports.push({
        ...escomplex.analyzeModule(file.source, {
          commonjs: true,
          logicalor: true,
          newmi: true,
        }),
        filePath: file.path,
      });
    } catch (e) {
      // ignore
    }
  });

  const result = {
    score: new Scorer().getAverage(reports.map((item) => item.maintainability)),
    reports,
  };
  fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.report.escomplex), JSON.stringify(result));
}
