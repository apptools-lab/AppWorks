export interface IScannerOptions {
  ignoreDirs: string[]
  supportExts: string[]
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

export interface IScannerReports {
  maintainability?: {
    score: number;
    reports: IMaintainabilityReport[]
  }
}
