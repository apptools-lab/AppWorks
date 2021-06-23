import * as vscode from 'vscode';
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
  const result = await doctor.scan(
    projectPath,
    Object.assign({ transforms: [transform] }, SCAN_OPTIONS),
  );
  setOutput(result.codemod?.reports[0].output || '');
  return result;
}

export async function activateCodemod(context: vscode.ExtensionContext) {
  const { env, window } = vscode;
  const isEn = env.language === 'en';

  const deprecatedPackageConfig = {};

  const reports = await doctor.scan(projectPath, SCAN_OPTIONS);

  // Show notifaction
  (reports.codemod?.reports || []).forEach((codemod) => {
    const action = 'Running a Codemod';

    if (codemod.npm_deprecate) {
      const pkg = parse(codemod.npm_deprecate);
      deprecatedPackageConfig[pkg.name] = {
        ...codemod,
        ...pkg,
      };
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
  });

  // Show deprecate package
  setDeprecatedPackage(deprecatedPackageConfig);
  vscode.window.onDidChangeActiveTextEditor(() => {
    setDeprecatedPackage(deprecatedPackageConfig);
  }, null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument(() => {
    setDeprecatedPackage(deprecatedPackageConfig);
  }, null, context.subscriptions);
}
