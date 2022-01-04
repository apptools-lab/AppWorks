import { IClone } from '@jscpd/core';
import type { ProjectLintResult, CodemodRule } from '@applint/applint';

export interface IScannerOptions {
  ignore?: string[];
}

export interface IScanOptions {
  fix?: boolean;
  framework?: string;
  transforms?: Record<string, number>;
  languageType?: 'js' | 'ts';
  tempFileDir?: string;
  timeout?: number;
  disableESLint?: boolean;
  disableMaintainability?: boolean;
  disableRepeatability?: boolean;
  disableCodemod?: boolean;
  maxRepeatabilityCheckLines?: number;
  customTransformRules?: Record<string, CodemodRule>;
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

export interface ICodemodReports {
  score: number;
  reports: ProjectLintResult;
}

export interface IScannerReports {
  filesInfo: {
    count: number;
    lines: number;
  };
  score?: number;
  scanTime?: number;
  ESLint?: IEslintReports;
  repeatability?: IRepeatabilityReports;
  codemod?: ICodemodReports;
  // the content is empty
  maintainability?: any;
}
