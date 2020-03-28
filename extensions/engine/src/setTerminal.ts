import * as vscode from 'vscode';

export default function setTerminal(cmd: string): any {
  let NEXT_TERM_ID = 1;
  let terminal = null;
  if (vscode.window.terminals.length) {
    terminal = vscode.window.terminals[0];
  } else {
    terminal = vscode.window.createTerminal({
      name: `ICE Terminal #${NEXT_TERM_ID++}`
    });
  }
  // terminal focus
  terminal.show();
  // exit last program
  terminal.sendText('\u0003');
  // run text
  terminal.sendText(cmd);

  // 终端的进程 id，不是执行的命令的 id
  // terminal.processId.then((processId) => {
  //   if (processId) {
  //     vscode.window.showInformationMessage(`Terminal.processId: ${processId}`);
  //   } else {
  //     vscode.window.showInformationMessage('Terminal does not have a process ID');
  //   }
  // });

  return terminal;
};
