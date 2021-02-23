import * as vscode from 'vscode';

export function getIceworksTerminal(terminalName = 'Iceworks') {
  const { terminals } = vscode.window;
  let terminal: vscode.Terminal;
  const targetTerminal = terminals.find((item) => item.name === terminalName);

  if (targetTerminal) {
    terminal = targetTerminal;
  } else {
    terminal = vscode.window.createTerminal(terminalName);
  }

  return terminal;
}
