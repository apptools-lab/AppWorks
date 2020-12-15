import { IClone } from '@jscpd/core';

export interface IScannerOptions {
  ignore: string[];
  supportExts: string[];
}

export interface IScanOptions {
  fix?: boolean;
  framework?: string;
  languageType?: 'js' | 'ts';
  tempFileDir?: string;
  timeout?: number;
  disableESLint?: boolean;
  disableMaintainability?: boolean;
  disableRepeatability?: boolean;
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

export interface IEslintReports {
  score: number;
  reports: any[];
  errorCount: number;
  warningCount: number;
  customConfig: any;
}

export interface IScannerReports {
  filesInfo: {
    count: number;
    lines: number;
  };
  score?: number;
  scanTime?: number;
  ESLint?: IEslintReports;
  maintainability?: IMaintainabilityReports;
  repeatability?: IRepeatabilityReports;
}
