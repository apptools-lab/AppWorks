/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const { jscpd } = require('jscpd');
const Scorer = require('../../Scorer').default;

// https://www.npmjs.com/package/jscpd
module.exports = async function getRepeatabilityReports(directory, tempFileDir, ignore) {
  let clones = [];
  let repetitionPercentage = 0;

  try {
    clones = await jscpd([
      '--format', '"typescript,javascript,tsx,jsx,html,css,less,scss,sass"',
      // .ice/xxx/xxx/xx.js can't be ignored, see: https://github.com/kucherenko/jscpd/issues/419
      path.join(directory, './src'),
      '--ignore',
      `"${ignore.split(',').map((ignoreDir) => `${path.join(directory, '/')}**/${ignoreDir}/**`).join(',')}"`,
      '--reporters',
      'json',
      '--output',
      tempFileDir,
      '--max-size',
      '30kb',
      '--mode',
      'weak',
      '--silent',
    ]);
    const repeatabilityResultFile = path.join(tempFileDir, 'jscpd-report.json');
    if (fs.existsSync(repeatabilityResultFile)) {
      const repeatabilityResult = fs.readJSONSync(repeatabilityResultFile);
      repetitionPercentage = repeatabilityResult.statistics.total.percentage;
    }
  } catch (e) {
    // ignore
    console.log(e);
  }

  return {
    // High repetitionPercentage is a big problem, increase the deduction
    score: new Scorer().minus(repetitionPercentage * 3),
    clones,
  };
};
