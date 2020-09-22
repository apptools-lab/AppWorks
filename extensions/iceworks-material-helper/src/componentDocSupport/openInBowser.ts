import * as vscode from 'vscode';
import i18n from '../i18n';

function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

function openInInternalBrowser(url: string) {
  if (hasBrowserPreviewExtension()) {
    vscode.commands.executeCommand('browser-preview.openPreview', url);
  } else {
    vscode.window.showErrorMessage(i18n.format('extension.iceworksMaterialHelper.openInBorwser.noBrowserPreview'));
  }
}

function openDocLinkInsideVSCode() {
  return vscode.workspace.getConfiguration('iceworks.materialHelper').get('openDocLinkInsideVSCode');
}

function hasBrowserPreviewExtension() {
  return vscode.extensions.getExtension('auchenberg.vscode-browser-preview');
}

export default function openInBrowser(url) {
  if (openDocLinkInsideVSCode()) {
    openInInternalBrowser(url);
  } else {
    openInExternalBrowser(url);
  }
}
