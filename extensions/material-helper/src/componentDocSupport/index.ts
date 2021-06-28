import * as vscode from 'vscode';
import getCurrentJsxElement from './getCurrentJsxElement';
import getHoverItem from './getHoverItem';
import { showUsedComponentDocQuickPicks, showComponentDocQuickPicks } from './componentQuickPicks';
import { initDocInfos } from './docInfoCache';
import services from '../services';

async function provideHover(document, position): Promise<vscode.Hover | undefined> {
  // const { Position } = vscode;
  const documentText = document.getText();
  const cursorPosition = document.offsetAt(position);
  const currentJsxElement: any = getCurrentJsxElement(documentText, cursorPosition);
  const currentJsxElementTagName = currentJsxElement ? currentJsxElement.name.name : '';

  if (currentJsxElement && getHoverItem(currentJsxElementTagName) !== undefined) {
    return getHoverItem(currentJsxElementTagName);
  }
}

// Set completion
export default function registerComponentDocSupport() {
  vscode.languages.registerHoverProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], {
    provideHover,
  });
  services.common.registerCommand('material-helper.showMaterialDocs', () => {
    showComponentDocQuickPicks();
  });
  services.common.registerCommand('material-helper.showMaterialDocsForCurrentFile', (uri: vscode.Uri) => {
    const currentFileUri = uri || vscode.window.activeTextEditor?.document.uri;
    if (currentFileUri) {
      showUsedComponentDocQuickPicks(currentFileUri);
    }
  });
  initDocInfos();
}
