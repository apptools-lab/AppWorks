import * as path from "path";
import * as fs from 'fs';
import * as vscode from 'vscode';
import { entryFileSuffix, npmClients, npmRegisters } from './constants';

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

export function createNpmCommand(action: string, target: string = '', extra: string = ''): string {
  const npmClient = getNpmClient();
  let register = '';
  if (!(npmClient === 'cnpm' || npmClient === 'tnpm' || action === 'run')) {
    register = `--register=${getNpmRegister()}`;
  }
  return `${npmClient} ${action} ${target} ${register} ${extra}`;
}

export function getNpmClient(): string {
  return vscode.workspace.getConfiguration('iceworks').get('npmClient') || npmClients[0];
}

export function getNpmRegister(): string {
  return vscode.workspace.getConfiguration('iceworks').get('npmRegister') || npmRegisters[0];
}