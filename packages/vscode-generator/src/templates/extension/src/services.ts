import * as vscode from 'vscode';
import * as common from '@appworks/common-service';

const openFile = (filePath: string) => {
  const { commands, Uri, ViewColumn } = vscode;

  commands.executeCommand('vscode.open', Uri.file(filePath), { viewColumn: ViewColumn.One });
};

export const services = {
  action: {
    open: openFile,
  },
  common,
};
