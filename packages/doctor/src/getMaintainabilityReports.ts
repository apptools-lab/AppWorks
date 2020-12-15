import * as escomplex from 'typhonjs-escomplex';
import Scorer from './Scorer';
import Timer from './Timer';
import { IMaintainabilityReport, IMaintainabilityReports } from './types/Scanner';
import { IFileInfo } from './types/File';

// https://www.npmjs.com/package/typhonjs-escomplex
export default function getMaintainabilityReports(timer: Timer, files: IFileInfo[]): IMaintainabilityReports {
  const reports = [];

  files.forEach((file) => {
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

    timer.checkTimeout();
  });

  return {
    score: new Scorer().getAverage(reports.map((item: IMaintainabilityReport) => item.maintainability)),
    reports,
  };
}
