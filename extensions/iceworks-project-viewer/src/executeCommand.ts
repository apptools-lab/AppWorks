import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { ITerminalMap } from './types';
import { makeTerminalPrettyName } from './utils';
import { Script } from './npmScripts';

export function executeCommand(terminalMapping: ITerminalMap) {
  return function (script: Script) {
    const args = script.command?.arguments!;
    const [task, cwd] = args;
    const packageManager: string = vscode.workspace.getConfiguration('npm').get('packageManager') || 'npm';

    const command: string = `${packageManager} run ${task}`;

    const name: string = makeTerminalPrettyName(cwd, task);

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
  };
}