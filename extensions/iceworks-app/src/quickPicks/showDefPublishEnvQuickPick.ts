import * as vscode from 'vscode';
import { ITerminalMap } from '../types';
import executeCommand from '../commands/executeCommand';

const { window } = vscode;

const DEFEnvOptions = [
  { label: 'daily', detail: '发布到日常环境', command: 'def p -d' },
  { label: 'prod', detail: '发布到线上环境', command: 'def p -o' },
]

export default function showDefPublishEnvQuickPick(terminalMapping: ITerminalMap, rootPath: string) {
  const quickPick = window.createQuickPick();
  quickPick.items = DEFEnvOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      const env = DEFEnvOptions.find(option => option.label === selection[0].label)!;
      const command: vscode.Command = {
        title: 'Publish',
        command: 'iceworksApp.DefPublish',
        arguments: [rootPath, env.command]
      }
      executeCommand(terminalMapping, command, `DefPublish-${env.label}`)
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
