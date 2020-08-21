import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';

export default function executeCommand(command: vscode.Command) {
  if (!command.arguments) {
    return;
  }
  const args = command.arguments;
  const [cwd, script] = args;
  if (!script) {
    return;
  }

  const terminals = vscode.window.terminals;

  let terminal: Terminal | undefined = terminals.find((terminal: Terminal) => terminal.name === script);
  if (!terminal) {
    const terminalOptions: TerminalOptions = { cwd, name: script };
    terminal = vscode.window.createTerminal(terminalOptions);
  }

  terminal.show();
  terminal.sendText(script);
}
