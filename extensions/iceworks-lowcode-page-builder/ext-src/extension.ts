import * as vscode from 'vscode';
import services from './services/index';
import { activate as activeWebview } from '@iceworks/vscode-webview/lib/vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "iceworks-lowcode-page-builder" is now active!');

  context.subscriptions.push(vscode.commands.registerCommand('iceworks-lowcode-page-builder.create', function() {
    activeWebview(context, { title: 'Create Page', services });
  }));
}

export function deactivate() {}
