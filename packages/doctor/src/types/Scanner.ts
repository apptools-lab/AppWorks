import { IClone } from '@jscpd/core';

export interface IScannerOptions {
  ignoreDirs: string[];
  supportExts: string[];
}

export interface IFileInfo {
  path: string;
  source: string;
  // lines of code
  LOC: number;
}

// https://www.npmjs.com/package/typhonjs-escomplex
export interface IMaintainabilityReport {
  classes: any[];
  errors: any[];
  methods: any[];
  aggregate: any;
  aggregateAverage: any;
  methodAverage: any;
  settings: any;
  srcPathAlias: any;
  filePath: string;
  srcPath: string;
  lineEnd: number;
  lineStart: number;
  maintainability: number;
}

export interface IMaintainabilityReports {
  score: number;
  reports: IMaintainabilityReport[];
}

export interface IRepeatabilityReports {
  score: number;
  clones: IClone[];
}

export interface IScannerReports {
  filesInfo: {
    count: number;
    lines: number;
  };
  maintainability?: IMaintainabilityReports;
  repeatability?: IRepeatabilityReports;
}
