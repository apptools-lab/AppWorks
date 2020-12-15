export interface IAnalyzerOptions {
  ignore: string[];
}

export interface IAnalyzerReport {
  languages: Array<{ language: string, count: number }>
}
