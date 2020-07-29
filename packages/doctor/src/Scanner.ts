import * as fs from 'fs';
import * as escomplex from 'typhonjs-escomplex';
import { IScannerOptions, IMaintainabilityReport, IScannerReports } from './types/Scanner';
import Scorer from './Scorer';
import getFiles from './getFiles';

export default class Scanner {

  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  private getMaintainabilityReports(files: string[]): IMaintainabilityReport[] {
    const reports = [];

    files.forEach(file => {
      let source = fs.readFileSync(file).toString().trim();
      if (!source) return;

      // if begins with shebang
      if (source[0] === '#' && source[1] === '!') {
        source = '//' + source;
      }

      try {
        const report = {
          ...escomplex.analyzeModule(source, {
            commonjs: true,
            logicalor: true,
            newmi: true
          }),
          filePath: file
        };

        reports.push(report);
      } catch (e) {
        // ignore
      }
    })
    return reports;
  }

  public scan(directory: string): Promise<IScannerReports> {
    return new Promise((resolve) => {
      const reports: IScannerReports = {};

      try {
        const files = getFiles(directory, this.options.supportExts, this.options.ignoreDirs);
        
        // Calculate maintainability
        const maintainabilityReports = this.getMaintainabilityReports(files);
        reports.maintainability = {
          score: new Scorer().getAverage(maintainabilityReports.map(item => item.maintainability)),
          reports: maintainabilityReports
        }
      } catch (error) {
        // ignore
      }

      resolve(reports);
    });
  }
}
