// import { IClone } from '@jscpd/core';

export interface IScannerOptions {
  ignoreDirs: string[];
  supportExts: string[];
}

export interface IFileInfo {
  path: string;
  source: string;
  // lines of code
  LoC: number;
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
  // clones: IClone[];
  clones: any[];
}

export interface IALiEslintReports {
  score: number;
  reports: any[];
}

export interface IScannerReports {
  filesInfo: {
    count: number;
    lines: number;
  };
  aliEslint?: IALiEslintReports;
  maintainability?: IMaintainabilityReports;
  repeatability?: IRepeatabilityReports;
}
