import * as vscode from 'vscode';

export function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

export function openInInternalBrowser(url: string) {
  vscode.commands.executeCommand('browser-preview.openPreview',url);
}
