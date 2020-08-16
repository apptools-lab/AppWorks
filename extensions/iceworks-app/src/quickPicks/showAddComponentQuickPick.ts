import * as vscode from 'vscode';
import i18n from '../i18n';

const { window, commands } = vscode;

const addComponentTypeOptions = [
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.generate-component',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.createComponent.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.createComponent.detail'),
    command: 'iceworks-ui-builder.create-component',
  },
];

export default function showAddComponentQuickPick() {
  const quickPick = window.createQuickPick();
  quickPick.items = addComponentTypeOptions.map((options) => ({ label: options.label, detail: options.detail }));
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
