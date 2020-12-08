import * as vscode from 'vscode';
import recorder from '../utils/recorder';

function openInExternalBrowser(url) {
  vscode.env.openExternal(url);
}

function openInInternalBrowser(url: string) {
  vscode.commands.executeCommand('browser-preview.openPreview', url);
}

function openDocLinkInsideVSCode() {
  return vscode.workspace.getConfiguration('iceworks.materialHelper').get('openDocLinkInsideVSCode') && vscode.extensions.getExtension('auchenberg.vscode-browser-preview');
}

export default function openInBrowser(url) {
  if (openDocLinkInsideVSCode()) {
    openInInternalBrowser(url);
  } else {
    openInExternalBrowser(url);
  }

  recorder.record({
    module: 'docSupport',
    action: 'openInBrowser',
    data: {
      url,
    },
  });
}
