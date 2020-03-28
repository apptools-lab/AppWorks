import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(vscode.commands.registerCommand('iceworks.example', function() {
    vscode.window.showInformationMessage('run iceworks example!');
  }));
}
