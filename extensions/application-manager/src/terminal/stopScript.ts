import * as vscode from 'vscode';

export default function stopScript(terminalName: string) {
  const { terminals } = vscode.window;

  const currentTerminal = terminals.find((terminal: vscode.Terminal) => terminal.name === terminalName);
  if (currentTerminal) {
    currentTerminal.dispose();
  }
}
