import * as vscode from 'vscode';
import { IImportDeclarations, getImportDeclarations } from './utils/getImportDeclarations';

let activeTextEditorId: string;
const { window, Position } = vscode;

export function getLastAcitveTextEditor() {
  const { visibleTextEditors } = window;
  const activeTextEditor = visibleTextEditors.find((item: any) => item.id === activeTextEditorId);
  console.log('window.activeTextEditor:', activeTextEditor);
  return activeTextEditor;
}

export function setLastActiveTextEditorId(id: string) {
  console.log('setLastActiveTextEditorId: run');
  activeTextEditorId = id;
}

interface IImportInfos {
  position: vscode.Position;
  declarations: IImportDeclarations[];
}

export async function getImportInfos(text: string): Promise<IImportInfos> {
  const importDeclarations: IImportDeclarations[] = await getImportDeclarations(text);

  const { length } = importDeclarations;
  let position;
  if (length) {
    position = new Position(importDeclarations[length - 1].loc.end.line, 0);
  } else {
    position = new Position(0, 0);
  }
  return { position, declarations: importDeclarations };
}
