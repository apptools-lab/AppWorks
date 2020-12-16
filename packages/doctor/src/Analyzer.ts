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
};

const UNKNOWN_LANGUAGE = 'Other';

export default class Analyzer {
  public options: IAnalyzerOptions;

  constructor(options: IAnalyzerOptions) {
    this.options = options;
  }

  public analyse(directory: string): IAnalyzerReport {
    const report = { languages: [] };
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

    return report;
  }
}
