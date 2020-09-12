import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import { Doctor } from '@iceworks/doctor';
import { projectPath } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import getProjectInfo from './getProjectInfo';

const scanReport = async (options) => {
  let report;
  try {
    const doctor = new Doctor({ ignore: ['.vscode', '.ice', 'mocks', '.eslintrc.js', 'webpack.config.js'] });
    report = await doctor.scan(projectPath, options);
  } catch (e) {
    report = {
      error: e,
    };
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
