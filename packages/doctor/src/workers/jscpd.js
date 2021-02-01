/* eslint-disable */
const fs = require('fs-extra');
const path = require('path');
const { jscpd } = require('jscpd');
const config = require('../config').default;
const Scorer = require('../Scorer').default;

const [directory, tempFileDir, ignore] = process.argv.slice(2)[0].split(' ');
getRepeatabilityReports();

// https://www.npmjs.com/package/jscpd
async function getRepeatabilityReports() {
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

  const result = {
    // High repetitionPercentage is a big problem, increase the deduction
    score: new Scorer().minus(repetitionPercentage * 3),
    clones,
  };

  fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.report.jscpd), JSON.stringify(result));
}
