import * as vscode from 'vscode';
import { projectPath } from '@iceworks/project-service';
import { checkIsO2, executeCommand as executeVSCodeCommand } from '@iceworks/common-service';
import runScript from '../terminal/runScript';
import i18n from '../i18n';

const { window } = vscode;

export default function showDefPublishEnvQuickPick() {
  const DEFEnvOptions = [
    {
      label: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.daily.label'),
      detail: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.daily.detail'),
      command: 'def p -d',
      value: 'daily',
    },
    {
      label: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.prod.label'),
      detail: i18n.format('extension.iceworksApp.showDefPublishEnvQuickPick.DEFEnvOptions.prod.detail'),
      command: 'def p -o',
      value: 'prod',
    },
  ];

  const quickPick = window.createQuickPick();
  quickPick.items = DEFEnvOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const env = DEFEnvOptions.find((option) => option.label === selection[0].label)!;
      if (!checkIsO2()) {
        runScript('DEF Publish', projectPath, env.command);
      } else {
        executeVSCodeCommand('core.def.publish', env.value);
      }
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
