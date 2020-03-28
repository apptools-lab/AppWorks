import * as vscode from 'vscode';
import start from './start';
import install from './install';
import build from './build';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('iceworks.start', start)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('iceworks.build', build)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('iceworks.install', install)
  );
}
