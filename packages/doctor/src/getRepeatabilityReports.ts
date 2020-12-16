import * as fs from 'fs-extra';
import * as path from 'path';
import { IClone } from '@jscpd/core';
import { jscpd } from 'jscpd';
import Scorer from './Scorer';
import { IRepeatabilityReports } from './types/Scanner';

const SUPPROT_FILE_EXTS = ['js', 'jsx', 'ts', 'tsx'];

// Write temp file directory
const tempDir = path.join(__dirname, 'tmp/');

// https://www.npmjs.com/package/jscpd
export default async function getRepeatabilityReports(
  directory: string,
  ignore: string[],
  tempFileDir?: string,
): Promise<IRepeatabilityReports> {
  let clones: IClone[] = [];
  let repetitionPercentage = 0;

  try {
    clones = await jscpd([
      '--formats-exts',
      SUPPROT_FILE_EXTS.join(','),
      directory,
      '--ignore',
      `"${ignore.map((ignoreDir) => `${path.join(directory, '/')}**/${ignoreDir}/**`).join(',')}"`,
      '--reporters',
      'json',
      '--output',
      tempFileDir || tempDir,
      '--silent',
    ]);

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
    score: new Scorer().minus(repetitionPercentage),
    clones,
  };
}
