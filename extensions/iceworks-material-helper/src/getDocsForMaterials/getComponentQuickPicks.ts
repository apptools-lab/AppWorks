/* eslint-disable dot-notation */
/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import getJsxElements from '../utils/getJsxElements';
import { openInBrowser } from './openInBowser';
import { getAllDocInfos } from './getAllDocInfos';
import { IMaterialDocInfo } from './type';

export default async function showAllMaterialQuickPicks() {
  showQuickPick(await getAllDocInfos());
}

export async function showDocumentMaterialQuickPick(uri: vscode.Uri) {
  const documentEditor = getVisibleEditer(uri);
  showQuickPick(await getDocInfos(documentEditor?.document.getText()));
}

function showQuickPick(quickPickItems: any[]) {
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

async function getDocInfos(documentText = ''): Promise<IMaterialDocInfo[]> {
  const docInfo: IMaterialDocInfo[] = [];
  const allDocInfo = getAllDocInfos();

  const materialNames = getAllDocInfos().map((docInfo) => docInfo.label);
  const jsxElementsOfUsedMaterials = getJsxElements(documentText, (element) => {
    return materialNames.includes(element.name['name'] || '');
  });

  jsxElementsOfUsedMaterials.forEach((elements) => {
    docInfo.push(
      allDocInfo.find((info) => {
        return (info.label = elements?.name['name']);
      })!
    );
  });
  docInfo.push({
    label: '更多物料',
    description: '展示所有物料的文档',
    detail: '展示所有物料的文档',
    command: 'iceworks-material-helper:showAllMaterialQuickPicks',
    url: '',
  });
  return docInfo;
}

function getVisibleEditer(uri: vscode.Uri) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.toString() === uri.toString();
  });
}
