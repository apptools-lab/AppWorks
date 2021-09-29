import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import * as semver from 'semver';
import { Doctor } from '@appworks/doctor';
import { projectPath } from '@appworks/project-service';
import parse from 'parse-package-name';
import setOutput from './setOutput';
import setDeprecatedPackage from './setDeprecatedPackage';

const doctor = new Doctor({ ignore: ['.vscode', '.ice', 'mocks', '.eslintrc.js', 'webpack.config.js'] });

const SCAN_OPTIONS = {
  disableESLint: true,
  disableMaintainability: true,
  disableRepeatability: true,
};

export async function runCodemod(transform: string) {
  const result = await doctor.scan(projectPath, Object.assign({ transforms: [transform] }, SCAN_OPTIONS));
  const { env, window } = vscode;
  const isEn = env.language === 'en';
  window.showInformationMessage(`${isEn ? 'Codemod run success, logs shows in the OUTPUT.' : 'Codemod 运行成功，运行日志将在 “输出” 中展示。'}`);
  setOutput(result.codemod?.reports[0].output || '');
  return result;
}

export async function activateCodemod(context: vscode.ExtensionContext) {
  const { env, window } = vscode;
  const isEn = env.language === 'en';

  const deprecatedPackageConfig = {};

  const packageFile = path.join(projectPath, 'package.json');
  const packageJSON = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, 'utf-8')) : {};

  // Show notifaction
  if (fs.existsSync(packageFile) && projectPath) {
    const reports = await doctor.scan(projectPath, SCAN_OPTIONS);
    (reports.codemod?.reports || []).forEach((codemod) => {
      if (codemod.severity > 0) {
        const action = 'Run a Codemod';

        if (codemod.npm_deprecate) {
          const { name, version } = parse(codemod.npm_deprecate);
          const dependencyVersion = (packageJSON.dependencies || {})[name] || (packageJSON.devDependencies || {})[name];
          const dependencySemver = semver.coerce(dependencyVersion);
          if (dependencySemver && semver.satisfies(dependencySemver, version || '*')) {
            deprecatedPackageConfig[name] = {
              ...codemod,
              name,
              version,
            };
          }
        }
        const message =
          `${isEn ? codemod.title_en : codemod.title}: ` +
          `${isEn ? codemod.message_en : codemod.message} ` +
          `( [${isEn ? 'docs' : '文档'}](${codemod.docs}) )`;
        const showMessage = codemod.severity === 2 ? window.showErrorMessage : window.showWarningMessage;

        showMessage(message, action).then(async (item) => {
          // Run codemod
          if (item === action) {
            const result = await runCodemod(codemod.transform);

            // Remove fixed deprecated package
            if (result.codemod?.reports[0].npm_deprecate) {
              delete deprecatedPackageConfig[result.codemod?.reports[0].npm_deprecate];
            }
          }
        });
      }
    });
  }

  // Show deprecate package
  setDeprecatedPackage(deprecatedPackageConfig);
  vscode.window.onDidChangeActiveTextEditor(
    () => {
      setDeprecatedPackage(deprecatedPackageConfig);
    },
    null,
    context.subscriptions,
  );
  vscode.workspace.onDidChangeTextDocument(
    () => {
      setDeprecatedPackage(deprecatedPackageConfig);
    },
    null,
    context.subscriptions,
  );
}
