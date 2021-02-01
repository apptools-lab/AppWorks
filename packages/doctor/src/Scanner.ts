/* eslint-disable max-len */
import * as fs from 'fs-extra';
import * as path from 'path';
import Timer from './Timer';
import { IScannerOptions, IScanOptions, IScannerReports } from './types/Scanner';
import { IFileInfo } from './types/File';
import * as execa from 'execa';
import config from './config';
import getFiles from './getFiles';
import getFinalScore from './getFinalScore';

// Write temp file directory
const tempDir = path.join(__dirname, 'tmp/');

export default class Scanner {
  public options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  // Entry
  public async scan(directory: string, options?: IScanOptions): Promise<IScannerReports> {
    const timer = new Timer(options?.timeout);
    const reports = {} as IScannerReports;
    const tempFileDir = options?.tempFileDir || tempDir;
    const subprocessList: any[] = [];

    if (!fs.pathExistsSync(tempFileDir)) {
      fs.mkdirpSync(tempFileDir);
    }

    const files: IFileInfo[] = getFiles(directory, this.options.ignore);

    // Set files info
    reports.filesInfo = {
      count: files.length,
      lines: files.reduce((total, file) => total + file.LoC, 0),
    };

    fs.writeFileSync(path.join(tempFileDir, config.tmpFiles.files), JSON.stringify(files));

    const shouldRunEslint = !options || options.disableESLint !== true;
    const shouldRunEscomplex = !options || options.disableMaintainability !== true;
    const shouldRunJscpd = (!options || options.disableRepeatability !== true) && (!options.maxRepeatabilityCheckLines || reports.filesInfo.lines < options.maxRepeatabilityCheckLines);

    // Run ESLint
    if (shouldRunEslint) {
      // Example: react react-ts rax rax-ts
      const ruleKey = `${options?.framework || 'react'}${options?.languageType === 'ts' ? '-ts' : ''}`;
      subprocessList.push(execa.node(path.join(__dirname, './workers/eslint.js'), [`${directory} ${tempFileDir} ${ruleKey} ${options?.fix}`]));
    }

    // Run maintainability
    if (shouldRunEscomplex) {
      subprocessList.push(execa.node(path.join(__dirname, './workers/escomplex.js'), [tempFileDir]));
    }

    // Run repeatability
    if (shouldRunJscpd) {
      subprocessList.push(execa.node(path.join(__dirname, './workers/jscpd.js'), [`${directory} ${tempFileDir} ${this.options.ignore}`]));
    }

    await Promise.all(subprocessList);
    // Set ESLint result
    if (shouldRunEslint) {
      reports.ESLint = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.report.eslint));
    }
    // Set maintainability result
    if (shouldRunEscomplex) {
      reports.maintainability = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.report.escomplex));
    }
    // Set repeatability result
    if (shouldRunJscpd) {
      reports.repeatability = fs.readJSONSync(path.join(tempFileDir, config.tmpFiles.report.jscpd));
    }

    // Calculate total score
    reports.score = getFinalScore(
      [
        (reports.ESLint || {}).score,
        (reports.maintainability || {}).score,
        (reports.repeatability || {}).score,
      ].filter((score) => !isNaN(score)),
    );

    // Duration seconds
    reports.scanTime = timer.duration();

    return reports;
  }
}
