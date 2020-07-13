import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { entryFileSuffix } from './constants';

export default function openEntryFile(p: string) {
  const currentSuffix = entryFileSuffix.find((suffix) => fsExtra.pathExistsSync(path.join(p, `index${suffix}`)));
  if (currentSuffix) {
    const resource = vscode.Uri.file(path.join(p, `index${currentSuffix}`));
    vscode.window.showTextDocument(resource);
  } else {
    vscode.window.showErrorMessage('Entry file not found.');
  }
}
