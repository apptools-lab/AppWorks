import * as path from 'path';
import * as vscode from 'vscode';
import { getProjectFramework } from '@iceworks/project-service';

let editingJsonFileUri: vscode.Uri;

export function getEditingFileName() {
  return path.parse(editingJsonFileUri.fsPath).name;
}
export function getBaseNameFormUri(uri: vscode.Uri) {
  return path.parse(uri.fsPath).base;
}
export function getEditingFileBaseName() {
  return path.parse(editingJsonFileUri.fsPath).base;
}

export function canEditInPanel(uri: vscode.Uri) {
  const forbiddenJsonFileList = ['package-lock.json'];
  if (forbiddenJsonFileList.includes(getBaseNameFormUri(uri))) {
    return false;
  } else {
    return true;
  }
}

export async function getFrameWorkFragement() {
  const framwork = await getProjectFramework();
  switch (framwork) {
    case 'icejs':
      return 'ice';
    case 'rax-app':
      return 'rax';
    default:
      return 'NO-Frame';
  }
}

export function getEditingJsonEditor() {
  return getVisibleTextEditor(editingJsonFileUri);
}
export function getVisibleTextEditor(uri: vscode.Uri) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.toString() === uri.toString();
  });
}

export function setEditingJsonFileUri(uri: vscode.Uri) {
  editingJsonFileUri = uri;
}
export function getEditingJsonFileUri() {
  return editingJsonFileUri;
}
