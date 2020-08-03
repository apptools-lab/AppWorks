import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { ITerminalMap } from '../types';

export default function executeCommand(terminalMapping: ITerminalMap, script: vscode.Command, id?: string) {
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
