import * as vscode from 'vscode';
import { IImponrtDeclarations, getImportDeclarations } from './getImportDeclarations';

const { Position } = vscode;

export interface IImportInfos {
  position: vscode.Position;
  declarations: IImponrtDeclarations[];
};

export default async function getImportInfos(text: string): Promise<IImportInfos> {
  const importDeclarations: IImponrtDeclarations[] = await getImportDeclarations(text);

  const length = importDeclarations.length;
  let position;
  if (length) {
    position = new Position(importDeclarations[length - 1].loc.end.line, 0);
  } else {
    position = new Position(0, 0);
  }
  return { position, declarations: importDeclarations };
}