import * as escomplex from 'typhonjs-escomplex';
import Scorer from '../../Scorer';
import { IMaintainabilityReport, IMaintainabilityReports } from '../../types/Scanner';
import { IFileInfo } from '../../types/File';

const SUPPORT_FILE_REG = /(\.js|\.jsx|\.ts|\.tsx|\.vue)$/;

// https://www.npmjs.com/package/typhonjs-escomplex
export default function getMaintainabilityReports(files: IFileInfo[]): IMaintainabilityReports {
  const reports = [];

  files.forEach((file) => {
    if (!SUPPORT_FILE_REG.test(file.path)) return;

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
  });

  return {
    score: new Scorer().getAverage(reports.map((item: IMaintainabilityReport) => item.maintainability)),
    reports,
  };
}
