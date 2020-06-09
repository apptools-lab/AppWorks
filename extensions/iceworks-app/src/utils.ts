import * as path from 'path';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { entryFileSuffix } from './constants';
import { ITerminalMap } from './types';

export function createTerminalName(cwd: string, command: string): string {
  return `${path.basename(cwd)} - ${command}`;
}

export function pathExists(p: string) {
  try {
    fse.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}

export function executeCommand(terminalMapping: ITerminalMap, script: vscode.Command) {
  if (!script.arguments) {
    return;
  }
  const args = script.arguments;
  const [cwd, command] = args;
  let terminalName = args[2];
  if (!command) {
    return;
  }
  terminalName = terminalName || command;
  const name: string = createTerminalName(cwd, terminalName);

  let terminal: Terminal;

  if (terminalMapping.has(name)) {
    terminal = terminalMapping.get(name)!;
  } else {
    const terminalOptions: TerminalOptions = { cwd, name };
    terminal = vscode.window.createTerminal(terminalOptions);
    terminalMapping.set(name, terminal);
  }

  terminal.show();
  terminal.sendText(command);
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
