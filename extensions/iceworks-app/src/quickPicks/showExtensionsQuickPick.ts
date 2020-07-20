import * as vscode from 'vscode';
import i18n from '../i18n';

const { window, commands } = vscode;

export default function showExtensionsQuickPick() {
  const extensionOptions = [
    { label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.projectCreater.label'),
      detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.projectCreater.detail'), 
      command: 'iceworks-project-creator.start', },
    { label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.pageBuilder.label'), 
      detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.pageBuilder.detail'), 
      command: 'iceworks-page-builder.create', },
    { label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.label'),
      detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.detail'), 
      command: 'iceworks-component-builder.generate' },
    { label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.materialImport.label'), 
      detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.materialImport.detail'),
      command: 'iceworks-material-import.start' },
  ]
  const quickPick = window.createQuickPick();
  quickPick.items = extensionOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      const currentExtension = extensionOptions.find(option => option.label === selection[0].label)!;
      commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
