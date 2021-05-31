import * as vscode from 'vscode';
import * as common from '@appworks/common-service';
import getScanReport from './getScanReport';

const openFile = (options) => {
  const { commands, Position, Range, Uri, ViewColumn } = vscode;
  let selection = new Range(
    new Position(options.line - 1, options.column - 1),
    new Position(options.line - 1, options.column - 1),
  );

  if (options.endLine && options.endColumn) {
    selection = new Range(
      new Position(options.line - 1, options.column - 1),
      new Position(options.endLine - 1, options.endColumn - 1),
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
    getScanReport,
  },
  common,
};
