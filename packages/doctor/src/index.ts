import getFiles from './getFiles';
import Analyzer from './Analyzer';
import Scanner from './Scanner';
import { IDoctorOptions } from './types/Doctor';
import { IScanOptions, IScannerReports } from './types/Scanner';
import { IFileInfo } from './types/File';

// Ignore directories
const defaultignore = ['build', 'es', 'dist', 'lib', 'mocks', 'coverage', 'node_modules', 'demo', 'examples', 'public', 'test', '__tests__'];
// Support file exts
const defaultSupportExts = ['js', 'jsx', 'ts', 'tsx'];

class Doctor {
  public options: any;

  public ignore: string[];

  public supportExts: string[];

  private scanner: any;

  private analyzer: any;

  constructor(options: IDoctorOptions) {
    this.options = options || {};

    this.ignore = defaultignore.concat(this.options.ignore || []);
    this.supportExts = defaultSupportExts.concat(this.options.supportExts || []);

    this.scanner = new Scanner({
      ignore: this.ignore,
      supportExts: this.supportExts,
    });

    this.analyzer = new Analyzer({ ignore: this.ignore });
  }

  scan(directory: string, options?: IScanOptions): Promise<IScannerReports> {
    return this.scanner.scan(directory, options);
  }

  analyse(directory: string) {
    this.analyzer.analyse(directory);
  }

  getFiles(directory: string): IFileInfo[] {
    return getFiles(directory, this.supportExts, this.ignore);
  }
}

export { Doctor };
