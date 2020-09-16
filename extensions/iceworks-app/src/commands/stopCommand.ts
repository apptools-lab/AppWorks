import * as vscode from 'vscode';

export default function stopCommand(command: vscode.Command) {
  const { terminals } = vscode.window;
  const commandArgs = command.arguments;
  if (!commandArgs) {
    return;
  }
  const [script] = commandArgs;
  if (!script) {
    return;
  }
  const currentTerminal = terminals.find((terminal: vscode.Terminal) => terminal.name === script);
  if (currentTerminal) {
    currentTerminal.dispose();
  }
}
