/* eslint-disable */
const escomplex = require('typhonjs-escomplex');
const Scorer = require('../../Scorer').default;

const SUPPORT_FILE_REG = /(\.js|\.jsx|\.ts|\.tsx|\.vue)$/;

// https://www.npmjs.com/package/typhonjs-escomplex
module.exports = function getMaintainabilityReports(files) {
  const reports = [];

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

  return {
    score: new Scorer().getAverage(reports.map((item) => item.maintainability)),
    reports,
  };
};
