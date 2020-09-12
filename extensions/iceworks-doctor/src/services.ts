import * as vscode from 'vscode';
import { projectPath } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import getProjectInfo from './getProjectInfo';
import getScanReport from './getScanReport';
import setDiagnostics from './setDiagnostics';

const scanReport = async (options) => {
  const report = await getScanReport(projectPath, options);
  if (!report.error && report.securityPractices) {
    setDiagnostics(report.securityPractices, true);
  }
  return report;
};

const openFile = (options) => {
  console.log(options);
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
