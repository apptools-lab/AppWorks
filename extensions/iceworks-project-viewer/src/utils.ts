import * as path from "path";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { entryFileSuffix } from './constants';

export function makeTerminalName(cwd: string, command: string): string {
  return `${path.basename(cwd)} - ${command}`;
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

export function getPackageManager(): string {
  return vscode.workspace.getConfiguration('npm').get('packageManager') || 'npm';
}