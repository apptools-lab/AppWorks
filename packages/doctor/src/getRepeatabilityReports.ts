import * as fs from 'fs-extra';
import * as path from 'path';
import { IClone } from '@jscpd/core';
import { jscpd } from 'jscpd';
import Scorer from './Scorer';
import Timer from './Timer';
import { IRepeatabilityReports } from './types/Scanner';


// Write temp file directory
const tempDir = path.join(__dirname, 'tmp/');

// https://www.npmjs.com/package/jscpd
export default async function getRepeatabilityReports(
  directory: string,
  timer: Timer,
  ignore: string[],
  tempFileDir?: string,
): Promise<IRepeatabilityReports> {
  let clones: IClone[] = [];
  let repetitionPercentage = 0;

  try {
    clones = await jscpd([
      '--format', '"typescript,javascript,tsx,jsx,html,css,less,scss,sass"',
      // .ice/xxx/xxx/xx.js can't be ignored, see: https://github.com/kucherenko/jscpd/issues/419
      path.join(directory, './src'),
      '--ignore',
      `"${ignore.map((ignoreDir) => `${path.join(directory, '/')}**/${ignoreDir}/**`).join(',')}"`,
      '--reporters',
      'json',
      '--output',
      tempFileDir || tempDir,
      '--max-size',
      '30kb',
      '--mode',
      'weak',
      '--silent',
    ]);

    timer.checkTimeout();

    const repeatabilityResultFile = path.join(tempFileDir || tempDir, 'jscpd-report.json');
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
}
