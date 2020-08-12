import * as vscode from 'vscode';
import getCurrentJsxElement from './getCurrentJsxElement';
import getHoverItem from './getHoverItem';
import showMaterialDocQuickPicks, { showUsedMaterialDocQuickPicks } from './getComponentQuickPicks';
import { initDocInfos } from './docInfoCache';

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
export default function registerMaterialDocFunction() {
  vscode.languages.registerHoverProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], {
    provideHover,
  });
  vscode.commands.registerCommand('iceworks-material-helper:showAllMaterialQuickPicks', () => {
    showMaterialDocQuickPicks();
  });
  vscode.commands.registerCommand('iceworks-material-helper:showCurrentMaterialQuickPicks', (uri: vscode.Uri) => {
    showUsedMaterialDocQuickPicks(uri);
  });
  initDocInfos();
}
