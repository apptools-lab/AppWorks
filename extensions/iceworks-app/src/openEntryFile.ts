import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { findIndexFile } from '@iceworks/common-service';

export default function openEntryFile(p: string) {
  const indexFile = findIndexFile(p);
  if (indexFile) {
    const resource = vscode.Uri.file(indexFile);
    vscode.window.showTextDocument(resource);
  } else {
    vscode.window.showErrorMessage('Entry file not found.');
  }
}
