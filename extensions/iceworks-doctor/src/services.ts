import * as vscode from 'vscode';
import { projectPath } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import { Recorder } from '@iceworks/recorder';
import getProjectInfo from './getProjectInfo';
import getScanReport from './getScanReport';
import setDiagnostics from './setDiagnostics';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

let user = { empId: vscode.env.machineId, account: 'anonymous' };
async function updateUser() {
  const isAliInternal = await common.checkIsAliInternal();
  if (isAliInternal) {
    user = await common.getUserInfo();
  }
}
updateUser();

const scanReport = async (options) => {
  const report = await getScanReport(projectPath, options);
  // Set VS Code problems
  if (!report.error && report.securityPractices) {
    setDiagnostics(report.securityPractices, true);
  }
  // Record data
  try {
    if (!report.error) {
      const { account, empId } = user;
      recorder.record({
        module: 'main',
        action: 'doctor',
        data: {
          userName: account,
          userId: empId,
          projectPath,
          score: report.score,
          aliEslint: report.aliEslint.score,
          bestPractices: report.bestPractices.score,
          securityPractices: report.securityPractices.score,
          maintainability: report.maintainability.score,
          repeatability: report.repeatability.score,
        },
      });
    }
  } catch (e) {
    // ignore
  }

  return report;
};

const openFile = (options) => {
  const { commands, Position, Range, Uri, ViewColumn } = vscode;

  commands.executeCommand('vscode.open', Uri.file(options.filePath), {
    viewColumn: ViewColumn.One,
    selection: new Range(
      new Position(options.line - 1, options.column - 1),
      new Position(options.endLine - 1, options.endColumn - 1)
    ),
  });
};

export const services = {
  action: {
    open: openFile,
  },
  data: {
    projectInfo: getProjectInfo,
    scanReport,
  },
  common,
};
