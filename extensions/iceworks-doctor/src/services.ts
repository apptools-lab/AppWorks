import * as vscode from 'vscode';
import * as common from '@iceworks/common-service';
import getProjectInfo from './getProjectInfo';
import getScanReport from './getScanReport';

const openFile = (options) => {
  const { commands, Position, Range, Uri, ViewColumn } = vscode;
  let selection = new Range(
    new Position(options.line, options.column),
    new Position(options.line, options.column),
  );

  if (options.endLine && options.endColumn) {
    selection = new Range(
      new Position(options.line, options.column),
      new Position(options.endLine, options.endColumn),
    );
  }
  commands.executeCommand('vscode.open', Uri.file(options.filePath), {
    viewColumn: ViewColumn.One,
    selection,
  });
};

export const services = {
  action: {
    open: openFile,
  },
  data: {
    getProjectInfo,
    getScanReport,
  },
  common,
};
