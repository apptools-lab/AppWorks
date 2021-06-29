export interface IAnalyzerOptions {
  ignore: string[];
}

export interface IAnalyzerReport {
  filesInfo: {
    count: number;
    lines: number;
  };
  languages: Array<{ language: string; count: number }>;
}
