import * as path from 'path';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { entryFileSuffix } from './constants';
import { ITerminalMap } from './types';

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
  if (!command) {
    return;
  }

  let terminal: Terminal;

  if (terminalMapping.has(command)) {
    terminal = terminalMapping.get(command)!;
  } else {
    const terminalOptions: TerminalOptions = { cwd, name: command };
    terminal = vscode.window.createTerminal(terminalOptions);
    terminalMapping.set(command, terminal);
  }

  terminal.show();
  terminal.sendText(command);
}

export function stopCommand(terminalMapping: ITerminalMap, script: vscode.Command) {
  if (!script.arguments) {
    return;
  }
  const args = script.arguments;
  const command = args[1];
  if (!command) {
    return;
  }
  const currentTerminal = terminalMapping.get(command);
  if (currentTerminal) {
    currentTerminal.dispose();
  }
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
