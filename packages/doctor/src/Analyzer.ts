import * as path from 'path';
import { IAnalyzerOptions, IAnalyzerReport } from './types/Analyzer';
import { IFileInfo } from './types/File';
import getFiles from './getFiles';

const LANGUAGE_MAP = {
  '.html': 'HTML',
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.css': 'CSS',
  '.scss': 'SASS',
  '.less': 'Less',
  '.md': 'Markdown',
  '.json': 'JSON',
  '.vue': 'VUE',
};

const UNKNOWN_LANGUAGE = 'Other';

export default class Analyzer {
  options: IAnalyzerOptions;

  constructor(options: IAnalyzerOptions) {
    this.options = options;
  }

  analyse(directory: string): IAnalyzerReport {
    const report = { languages: [] } as IAnalyzerReport;
    const languageCache = {};
    const files: IFileInfo[] = getFiles(directory, this.options.ignore);

    files.forEach((file: IFileInfo) => {
      const language = LANGUAGE_MAP[path.extname(file.path)] || UNKNOWN_LANGUAGE;
      if (!languageCache[language]) {
        languageCache[language] = { language, count: 1 };
      } else {
        languageCache[language].count++;
      }
    });

    Object.keys(languageCache).forEach((key) => {
      report.languages.push(languageCache[key]);
    });

    report.filesInfo = {
      count: files.length,
      lines: files.reduce((total, file) => total + file.LoC, 0),
    };

    return report;
  }
}
