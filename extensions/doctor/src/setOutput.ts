import * as vscode from 'vscode';

const channel = vscode.window.createOutputChannel('Doctor');

export default function (message: string) {
  channel.appendLine(message);
  channel.show();
}
