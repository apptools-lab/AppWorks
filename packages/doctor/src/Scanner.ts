import * as fs from 'fs-extra';
import * as path from 'path';
import * as escomplex from 'typhonjs-escomplex';
import { IClone } from '@jscpd/core';
import { jscpd } from 'jscpd';
import { IScannerOptions, IFileInfo, IMaintainabilityReport, IScannerReports } from './types/Scanner';
import Scorer from './Scorer';
import getFiles from './getFiles';

// Write temp file directory 
const tempDir = path.join(__dirname, 'tmp/');

export default class Scanner {

  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  private getFiles(directory: string): IFileInfo[] {
    return getFiles(directory, this.options.supportExts, this.options.ignoreDirs).map((filePath) => {
      let source = fs.readFileSync(filePath).toString().trim();

      // if begins with shebang
      if (source[0] === '#' && source[1] === '!') {
        source = `//${source}`;
      }

      return {
        path: filePath,
        source,
        LOC: (source.match(/\n/g) || '').length + 1
      }
    })
  }

  // https://www.npmjs.com/package/typhonjs-escomplex
  private getMaintainabilityReports(files: IFileInfo[]): IMaintainabilityReport[] {
    const reports = [];

    files.forEach(file => {
      try {
        reports.push({
          ...escomplex.analyzeModule(file.source, {
            commonjs: true,
            logicalor: true,
            newmi: true
          }),
          filePath: file.path
        });
      } catch (e) {
        // ignore
      }
    })
    return reports;
  }

  // https://www.npmjs.com/package/jscpd
  private async getRepeatabilityReports(directory: string): Promise<IClone[]> {
    let reports = []
    try {
      reports = await jscpd([
        '--formats-exts', this.options.supportExts.join(','),
        directory,
        '--ignore', `"${this.options.ignoreDirs.map(ignoreDir => `${path.join(directory, '/')}**/${ignoreDir}/**`).join(',')}"`,
        '--reporters', 'json',
        '--output', tempDir,
        '--silent'
      ]);
    } catch (e) {
      // ignore
    }
    return reports;
  }

  // Entry
  public async scan(directory: string): Promise<IScannerReports> {

    const reports = {} as IScannerReports;

    try {
      const files = this.getFiles(directory);

      reports.filesInfo = {
        count: files.length,
        lines: files.reduce((total, file) => { return total + file.LOC }, 0)
      }

      // Calculate maintainability
      const maintainabilityReports = this.getMaintainabilityReports(files);
      reports.maintainability = {
        score: new Scorer().getAverage(maintainabilityReports.map(item => item.maintainability)),
        reports: maintainabilityReports
      }

      // Calculate repeatability
      let repetitionPercentage = 0;
      const repeatabilityReports = await this.getRepeatabilityReports(directory);
      const repeatabilityResultFile = path.join(tempDir, 'jscpd-report.json');
      if (fs.existsSync(repeatabilityResultFile)) {
        const repeatabilityResult = fs.readJSONSync(repeatabilityResultFile);
        repetitionPercentage = repeatabilityResult.statistics.total.percentage;
      }

      reports.repeatability = {
        score: new Scorer().minus(repetitionPercentage),
        clones: repeatabilityReports
      }
    } catch (error) {
      // ignore
    }

    return reports;
  }
}
