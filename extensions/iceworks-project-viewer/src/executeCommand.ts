import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { ITerminalMap } from './types';
import { makeTerminalName } from './utils';

export function executeCommand(terminalMapping: ITerminalMap, script: any) {
  const args = script.command?.arguments!;
  let [cwd, command, terminalName] = args;
  if (!command) {
    return;
  }
  terminalName = terminalName ? terminalName : command;
  const name: string = makeTerminalName(cwd, terminalName);

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