import * as fs from 'fs-extra';
import * as path from 'path';
import { IClone } from '@jscpd/core';
import { jscpd } from 'jscpd';
import Scorer from '../../Scorer';
import { IRepeatabilityReports } from '../../types/Scanner';

// https://www.npmjs.com/package/jscpd
export default async function getRepeatabilityReports(directory: string, tempFileDir: string, ignore: string): Promise<IRepeatabilityReports> {
  let clones: IClone[] = [];
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
}
