import * as path from 'path';
import * as vscode from 'vscode';

export interface ICodeInfo {
  line: vscode.TextLine;
  word: string;
  fileName: string;
  directory: string;
}

export function getFocusCodeInfo(document: vscode.TextDocument, position: vscode.Position): ICodeInfo {
  return {
    // Code info
    line: document.lineAt(position),
    word: document.getText(document.getWordRangeAtPosition(position)),

    // File info
    fileName: document.fileName,
    directory: path.dirname(document.fileName),
  };
}
