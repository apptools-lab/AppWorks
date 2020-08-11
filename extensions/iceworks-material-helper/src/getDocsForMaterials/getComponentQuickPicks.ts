/* eslint-disable dot-notation */
/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import getJsxElements from '../utils/getJsxElements';
import { openInBrowser } from './openInBowser';
import { getAllDocInfos } from './getAllDocInfos';
import { IMaterialDocInfo } from './type';
import i18n from '../i18n';

export default async function showAllMaterialQuickPicks() {
  showQuickPick(await getAllDocInfos());
}

export async function showDocumentMaterialQuickPick(uri: vscode.Uri) {
  const documentEditor = getVisibleEditer(uri);
  showQuickPick(await getDocInfos(documentEditor?.document.getText()));
}

function showQuickPick(quickPickItems: any[]) {
  if (quickPickItems.length === 0) {
    vscode.window.showWarningMessage(i18n.format('extension.iceworksMaterialHelper.getComponentQuickPicks.noMaterial'));
  } else {
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = quickPickItems;
    quickPick.onDidChangeSelection((selection) => {
      if (selection[0]['command']) {
        vscode.commands.executeCommand(selection[0]['command']);
      } else {
        openInBrowser(selection[0]['url']);
      }
      quickPick.dispose();
    });
    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
  }
}

async function getDocInfos(documentText = ''): Promise<IMaterialDocInfo[]> {
  const docInfos: IMaterialDocInfo[] = [];
  const allDocInfos = getAllDocInfos();

  const materialNames = getAllDocInfos().map((docInfo) => docInfo.label);
  const useingMaterialsJsxElements = getJsxElements(documentText, (element) => {
    return materialNames.includes(element.name['name'] || '');
  });

  useingMaterialsJsxElements.forEach((elements) => {
    docInfos.push(
      allDocInfos.find((info) => {
        return info.label === elements?.name['name'];
      })!
    );
  });
  docInfos.push({
    label: i18n.format('extension.iceworksMaterialHelper.getComponentQuickPicks.more.label'),
    description: '',
    detail: i18n.format('extension.iceworksMaterialHelper.getComponentQuickPicks.more.detail'),
    command: 'iceworks-material-helper:showAllMaterialQuickPicks',
    url: '',
  });
  return docInfos;
}

function getVisibleEditer(uri: vscode.Uri) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.toString() === uri.toString();
  });
}
