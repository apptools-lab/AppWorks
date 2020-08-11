import * as vscode from 'vscode';
import { recordDAU } from '@iceworks/recorder';

function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

function openInInternalBrowser(url: string) {
  vscode.commands.executeCommand('browser-preview.openPreview',url);
}

export function openInBrowser(url){
  openInExternalBrowser(url);
  recordDAU();
}
