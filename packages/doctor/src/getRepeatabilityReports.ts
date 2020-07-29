import * as fs from 'fs-extra';
import * as path from 'path';
import { IClone } from '@jscpd/core';
import { jscpd } from 'jscpd';
import Scorer from './Scorer';
import { IRepeatabilityReports } from './types/Scanner';

// Write temp file directory 
const tempDir = path.join(__dirname, 'tmp/');

// https://www.npmjs.com/package/jscpd
export default async function getRepeatabilityReports(
  directory: string,
  supportExts: string[],
  ignoreDirs: string[]
): Promise<IRepeatabilityReports> {
  let clones: IClone[] = [];
  let repetitionPercentage = 0;

  try {
    clones = await jscpd([
      '--formats-exts', supportExts.join(','),
      directory,
      '--ignore', `"${ignoreDirs.map(ignoreDir => `${path.join(directory, '/')}**/${ignoreDir}/**`).join(',')}"`,
      '--reporters', 'json',
      '--output', tempDir,
      '--silent'
    ]);

    const repeatabilityResultFile = path.join(tempDir, 'jscpd-report.json');
    if (fs.existsSync(repeatabilityResultFile)) {
      const repeatabilityResult = fs.readJSONSync(repeatabilityResultFile);
      repetitionPercentage = repeatabilityResult.statistics.total.percentage;
    }
  } catch (e) {
    // ignore
    console.log(e);
  }

  return {
    score: new Scorer().minus(repetitionPercentage),
    clones
  };
}
