import * as path from 'path';
import * as vscode from 'vscode';

export function getFileNameFromUri(uri: vscode.Uri) {
  return path.parse(uri.fsPath).name;
}
export function getBaseNameFromUri(uri: vscode.Uri) {
  return path.parse(uri.fsPath).base;
}

export function canEditInPanel(uri: vscode.Uri) {
  const forbiddenJsonFileList = ['package-lock.json'];
  if (forbiddenJsonFileList.includes(getBaseNameFromUri(uri))) {
    return false;
  } else {
    return true;
  }
}
