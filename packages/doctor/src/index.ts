import Scanner from './Scanner';
import { IDoctorOptions } from './types/Doctor';
import { IScanOptions, IScannerReports } from './types/Scanner';

// Ignore directories
const defaultignore = ['build', 'es', 'dist', 'lib', 'mocks', 'node_modules', 'demo', 'public', 'test', '__tests__'];
// Support file exts
const defaultSupportExts = ['js', 'jsx', 'ts', 'tsx'];

class Doctor {
  public options: any;

  private scanner: any;

  constructor(options: IDoctorOptions) {
    this.options = options || {};
    this.scanner = new Scanner({
      ignore: defaultignore.concat(this.options.ignore || []),
      supportExts: defaultSupportExts.concat(this.options.supportExts || []),
    });
  }

  scan(directory: string, options?: IScanOptions): Promise<IScannerReports> {
    return this.scanner.scan(directory, options);
  }
}

export { Doctor };
