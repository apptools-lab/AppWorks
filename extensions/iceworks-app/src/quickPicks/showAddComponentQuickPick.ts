import * as vscode from 'vscode';
import i18n from '../i18n';
import getOptions from '../utils/getOptions';
import { checkIsO2 } from '@iceworks/common-service';

const { window, commands } = vscode;

const addComponentTypeOptions = [
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.design-component',
    async condition() {
      const isO2 = checkIsO2();
      return !isO2;
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.detail'),
    command: 'iceworks-material-helper.component-creator.start',
  },
];

export default async function showAddComponentQuickPick() {
  const quickPick = window.createQuickPick();
  quickPick.items = await getOptions(addComponentTypeOptions);
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const currentExtension = addComponentTypeOptions.find((option) => option.label === selection[0].label)!;
      commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
