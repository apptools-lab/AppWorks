import * as path from "path";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { entryFileSuffix } from './constants';

export function makeTerminalPrettyName(cwd: string, taskName: string): string {
  return `${path.basename(cwd)} - ${taskName}`;
}

export function pathExists(p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}

export function openEntryFile(p: string) {
  const currentSuffix = entryFileSuffix.find(suffix => pathExists(path.join(p, `index${suffix}`)));
  if (currentSuffix) {
    const resource = vscode.Uri.file(path.join(p, `index${currentSuffix}`));
    vscode.window.showTextDocument(resource);
  } else {
    vscode.window.showErrorMessage('Entry file not found.');
  }
}
