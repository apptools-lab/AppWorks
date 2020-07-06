import * as path from 'path';
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { Terminal, TerminalOptions } from 'vscode';
import { entryFileSuffix } from './constants';
import { ITerminalMap } from './types';

export function executeCommand(terminalMapping: ITerminalMap, script: vscode.Command, id?: string) {
  if (!script.arguments) {
    return;
  }
  const args = script.arguments;
  const [cwd, command] = args;
  if (!command) {
    return;
  }

  const terminalId = id || command;
  let terminal: Terminal;

  if (terminalMapping.has(terminalId)) {
    terminal = terminalMapping.get(terminalId)!;
  } else {
    const terminalOptions: TerminalOptions = { cwd, name: command };
    terminal = vscode.window.createTerminal(terminalOptions);
    terminalMapping.set(terminalId, terminal);
  }

  terminal.show();
  terminal.sendText(command);
}

export function stopCommand(terminalMapping: ITerminalMap, scriptId: string) {
  const currentTerminal = terminalMapping.get(scriptId);
  if (currentTerminal) {
    currentTerminal.dispose();
    terminalMapping.delete(scriptId);
  }
}

export function openEntryFile(p: string) {
  const currentSuffix = entryFileSuffix.find((suffix) => fsExtra.pathExistsSync(path.join(p, `index${suffix}`)));
  if (currentSuffix) {
    const resource = vscode.Uri.file(path.join(p, `index${currentSuffix}`));
    vscode.window.showTextDocument(resource);
  } else {
    vscode.window.showErrorMessage('Entry file not found.');
  }
}
