import * as escomplex from 'typhonjs-escomplex';
import Scorer from './Scorer';
import { IFileInfo, IMaintainabilityReport, IMaintainabilityReports } from './types/Scanner';

// https://www.npmjs.com/package/typhonjs-escomplex
export default function getMaintainabilityReports(files: IFileInfo[]): IMaintainabilityReports {
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
  });

  return {
    score: new Scorer().getAverage(reports.map((item: IMaintainabilityReport) => item.maintainability)),
    reports
  };
}
