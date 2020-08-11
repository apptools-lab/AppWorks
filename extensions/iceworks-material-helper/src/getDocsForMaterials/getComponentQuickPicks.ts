/* eslint-disable dot-notation */
/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import { getSources } from '@iceworks/material-service';
import getJsxElements from '../utils/getJsxElements';
import { openInBrowser } from './openInBowser';
import { getSource } from './sourceManager';
import { SourceType, IQuickPickInfo } from './type';

export default async function showAllMaterialQuickPicks() {
  showQuickPick(
    await getSource(SourceType.QUICK_PICK_INFO)
  );
}

export async function showDocumentMaterialQuickPick(uri: vscode.Uri){
  const documentEditor = getVisibleEditer(uri);
  showQuickPick(
    await getMaterialsInfo(documentEditor?.document.getText())
  )
}

function showQuickPick(quickPickItems: any[]){
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = quickPickItems;
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      openInBrowser(selection[0]['homepage']);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(()=>quickPick.dispose());
  quickPick.show();
}

async function getMaterialsInfo(documentText=''): Promise<IQuickPickInfo[]>{
  const materialInfo = await getSources(SourceType.QUICK_PICK_INFO);
  const materialNameList = materialInfo.map(info=>info.name);
  const elements =  getJsxElements(documentText,element=>{
      return materialNameList.includes(element.name['name']||'')
  });
  console.log('elements',elements);
  return [{label:'更多物料',description:'展示所有物料的文档',detail:'',homepage: vscode.Uri.parse('iceworks-material-helper:showAllMaterialQuickPicks',true).toString()}]
}

function getVisibleEditer(uri: vscode.Uri){
  return vscode.window.visibleTextEditors.find(editor=>{
    return editor.document.uri.toString() === uri.toString();
  })
}