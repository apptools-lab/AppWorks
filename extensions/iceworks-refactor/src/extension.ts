import * as vscode from 'vscode';
import { registerCommand, initExtension } from '@iceworks/common-service';

function activate(context: vscode.ExtensionContext) {
  // auto set configuration
  initExtension(context);

  registerCommand('iceworks-refactor.hello', () => {
    vscode.window.showInformationMessage('Hello World!');
  });
}

exports.activate = activate;
