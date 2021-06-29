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
  options: IScannerOptions;

  constructor(options: IScannerOptions) {
    this.options = options;
  }

  // Entry
  async scan(directory: string, options?: IScanOptions): Promise<IScannerReports> {
    const timer = new Timer();
    const reports = {} as IScannerReports;
    const tempFileDir = options?.tempFileDir || tempDir;
    const subprocessList: any[] = [];
    const processReportList: any[] = [];

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

    // Run ESLint
    if (!options || options.disableESLint !== true) {
      // Example: react react-ts rax rax-ts, support common and common-ts
      const ruleKey = `${options?.framework || 'react'}${options?.languageType === 'ts' ? '-ts' : ''}`.replace(/^unknown/, 'common');
      subprocessList.push(execa.node(path.join(__dirname, './workers/eslint/index.js'), [`${directory} ${tempFileDir} ${ruleKey} ${options?.fix}`]));
      processReportList.push(async () => {
        reports.ESLint = await fs.readJSON(path.join(tempFileDir, config.tmpFiles.report.eslint));
      });
    }

    // Run maintainability
    if (!options || options.disableMaintainability !== true) {
      subprocessList.push(execa.node(path.join(__dirname, './workers/escomplex/index.js'), [tempFileDir]));
      processReportList.push(async () => {
        reports.maintainability = await fs.readJSON(path.join(tempFileDir, config.tmpFiles.report.escomplex));
      });
    }

    // Run repeatability
    if ((!options || options.disableRepeatability !== true) && (!options.maxRepeatabilityCheckLines || reports.filesInfo.lines < options.maxRepeatabilityCheckLines)) {
      subprocessList.push(execa.node(path.join(__dirname, './workers/jscpd/index.js'), [`${directory} ${tempFileDir} ${this.options.ignore}`]));
      processReportList.push(async () => {
        reports.repeatability = await fs.readJSON(path.join(tempFileDir, config.tmpFiles.report.jscpd));
      });
    }

    // Run Codemod
    if (!options || options.disableCodemod !== true) {
      subprocessList.push(execa.node(path.join(__dirname, './workers/codemod/index.js'), [`${directory} ${tempFileDir} ${options?.transforms}`]));
      processReportList.push(async () => {
        reports.codemod = await fs.readJSON(path.join(tempFileDir, config.tmpFiles.report.codemod));
      });
    }

    async function process() {
      // Check
      await Promise.all(subprocessList);
      // Set result
      await Promise.all(processReportList.map(async (fn) => { await fn(); }));

      // Calculate total score
      reports.score = getFinalScore(
        [
          (reports.ESLint || {}).score,
          (reports.maintainability || {}).score,
          (reports.repeatability || {}).score,
          (reports.codemod || {}).score,
        ].filter((score) => !isNaN(score)),
      );

      // Duration seconds
      reports.scanTime = timer.duration();
    }

    if (options.timeout) {
      await Promise.race([timer.raceTimeout(options.timeout), process()]);
    } else {
      await process();
    }

    return reports;
  }
}
