import * as vscode from 'vscode';
import { recordDAU } from '@iceworks/recorder';

function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

function openInInternalBrowser(url: string) {
  if (hasBrowserPreviewExtension()) {
    vscode.commands.executeCommand('browser-preview.openPreview', url);
  } else {
    vscode.window.showErrorMessage('你必须先安装 vscode-browser-preview 插件才能在内部浏览器中打开。');
  }
}

export function openInBrowser(url) {
  if (openDocLinkInsideVSCode()) {
    openInInternalBrowser(url);
  } else {
    openInExternalBrowser(url);
  }
  recordDAU();
}

function openDocLinkInsideVSCode() {
  return vscode.workspace.getConfiguration('iceworks.materialHelper').get('openDocLinkInsideVSCode');
}

function hasBrowserPreviewExtension() {
  return vscode.extensions.getExtension('auchenberg.vscode-browser-preview');
}
