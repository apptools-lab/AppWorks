import * as path from 'path';
import Mocha from 'mocha';
import glob from 'glob';
import * as fse from 'fs-extra';
import istanbul from 'istanbul';
import remapIstanbul from 'remap-istanbul';

// fork form https://github.com/rpeshkov/vscode-testcov/blob/master/test/index.ts
interface ITestRunnerOptions {
  enabled?: boolean;
  relativeCoverageDir: string;
  relativeSourcePath: string;
  ignorePatterns: string[];
  includePid?: boolean;
  reports?: string[];
  verbose?: boolean;
}

function readCoverOptions(testsRoot: string): ITestRunnerOptions | undefined {
  const coverConfigPath = path.join(testsRoot, '../../', 'coverconfig.json');
  if (fse.existsSync(coverConfigPath)) {
    const configContent = fse.readFileSync(coverConfigPath, 'utf-8');
    return JSON.parse(configContent);
  }
  return undefined;
}

class CoverageRunner {
  private coverageVar = `$$cov_${ new Date().getTime() }$$`;

  private transformer: any = undefined;

  private matchFn: any = undefined;

  private instrumenter: any = undefined;

  private options: ITestRunnerOptions = {} as ITestRunnerOptions;

  private testsRoot = '';

  constructor(options: ITestRunnerOptions, testsRoot: string) {
    if (!options.relativeSourcePath) {
      return;
    }
    this.testsRoot = testsRoot;
    this.options = options;
  }

  setupCoverage(): void {
    // Set up Code Coverage, hooking require so that instrumented code is returned
    const self = this;
    self.instrumenter = new istanbul.Instrumenter({ coverageVariable: self.coverageVar });
    const sourceRoot = path.join(self.testsRoot, self.options.relativeSourcePath);
    // Glob source files
    const srcFiles = glob.sync('**/**.js', {
      cwd: sourceRoot,
      ignore: self.options.ignorePatterns,
    });

    // Create a match function - taken from the run-with-cover.js in istanbul.
    const decache = require('decache');
    const fileMap: any = {};
    srcFiles.forEach((file) => {
      const fullPath = path.join(sourceRoot, file);
      fileMap[fullPath] = true;

      // On Windows, extension is loaded pre-test hooks and this mean we lose
      // our chance to hook the Require call. In order to instrument the code
      // we have to decache the JS file so on next load it gets instrumented.
      // This doesn't impact tests, but is a concern if we had some integration
      // tests that relied on VSCode accessing our module since there could be
      // some shared global state that we lose.
      decache(fullPath);
    });

    self.matchFn = (file: string): boolean => fileMap[file];
    self.matchFn.files = Object.keys(fileMap);

    // Hook up to the Require function so that when this is called, if any of our source files
    // are required, the instrumented version is pulled in instead. These instrumented versions
    // write to a global coverage variable with hit counts whenever they are accessed
    self.transformer = self.instrumenter.instrumentSync.bind(self.instrumenter);
    const hookOpts = { verbose: false, extensions: ['.js'] };
    istanbul.hook.hookRequire(self.matchFn, self.transformer, hookOpts);

    // initialize the global variable to stop mocha from complaining about leaks
    global[self.coverageVar] = {};

    // Hook the process exit event to handle reporting
    // Only report coverage if the process is exiting successfully
    process.on('exit', (code: number) => {
      self.reportCoverage();
      process.exitCode = code;
    });
  }

  /**
   * Writes a coverage report.
   * Note that as this is called in the process exit callback, all calls must be synchronous.
   *
   * @returns {void}
   *
   * @memberOf CoverageRunner
   */
  reportCoverage(): void {
    const self = this;
    istanbul.hook.unhookRequire();
    let cov: any;
    if (typeof global[self.coverageVar] === 'undefined' || Object.keys(global[self.coverageVar]).length === 0) {
      console.error('No coverage information was collected, exit without writing coverage information');
      return;
    } else {
      cov = global[self.coverageVar];
    }
    // TODO consider putting this under a conditional flag
    // Files that are not touched by code ran by the test runner is manually instrumented, to
    // illustrate the missing coverage.
    self.matchFn.files.forEach((file: any) => {
      if (cov[file]) {
        return;
      }
      self.transformer(fse.readFileSync(file, 'utf-8'), file);
      // When instrumenting the code, istanbul will give each FunctionDeclaration a value of 1 in coverState.s,
      // presumably to compensate for function hoisting. We need to reset this, as the function was not hoisted,
      // as it was never loaded.
      Object.keys(self.instrumenter.coverState.s).forEach((key) => {
        self.instrumenter.coverState.s[key] = 0;
      });

      cov[file] = self.instrumenter.coverState;
    });

    // TODO Allow config of reporting directory with
    const reportingDir = path.join(self.testsRoot, self.options.relativeCoverageDir);
    const { includePid } = self.options;
    const pidExt = includePid ? (`-${ process.pid}`) : '';
    const coverageFile = path.resolve(reportingDir, `coverage${ pidExt }.json`);
    fse.emptyDirSync(reportingDir);

    fse.writeFileSync(coverageFile, JSON.stringify(cov), 'utf8');

    const coverage = remapIstanbul.loadCoverage(coverageFile);
    console.log('coverage: ', coverage);
    const remappedCollector = remapIstanbul.remap(coverage);

    const reporter = new istanbul.Reporter(undefined, reportingDir);
    const reportTypes = (self.options.reports instanceof Array) ? self.options.reports : ['lcov'];
    reporter.addAll(reportTypes);
    reporter.write(remappedCollector, true, () => {
      console.log(`reports written to ${reportingDir}`);
    });
  }
}

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });

  const testsRoot = path.resolve(__dirname, '..');
  const coverOptions = readCoverOptions(testsRoot);
  if (coverOptions && coverOptions.enabled) {
    const coverageRunner = new CoverageRunner(coverOptions, testsRoot);
    coverageRunner.setupCoverage();
  }

  return new Promise((c, e) => {
    glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (error) {
        e(error);
      }
    });
  });
}
