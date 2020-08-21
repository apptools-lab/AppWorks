import * as vscode from 'vscode';
import { projectPath } from '@iceworks/project-service';
import executeCommand from '../commands/executeCommand';
import i18n from '../i18n';

const { window } = vscode;

export default function showDefPublishEnvQuickPick() {
  const DEFEnvOptions = [
    {
      label: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.daily.label'),
      detail: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.daily.detail'),
      command: 'def p -d',
    },
    {
      label: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.prod.label'),
      detail: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.prod.detail'),
      command: 'def p -o',
    },
  ];

  const quickPick = window.createQuickPick();
  quickPick.items = DEFEnvOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const env = DEFEnvOptions.find((option) => option.label === selection[0].label)!;
      const command: vscode.Command = {
        title: 'Publish',
        command: 'iceworksApp.editorMenu.DefPublish',
        arguments: [projectPath, env.command],
      };
      executeCommand(command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
