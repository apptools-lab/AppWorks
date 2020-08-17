import * as vscode from 'vscode';
import i18n from '../i18n';

const { window, commands } = vscode;

const extensionOptions = [
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.projectCreater.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.projectCreater.detail'),
    command: 'iceworks-project-creator.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.generate-component',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.pageBuilder.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.pageBuilder.detail'),
    command: 'iceworks-ui-builder.generate-page',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.materialImport.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.materialImport.detail'),
    command: 'iceworks-material-helper.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.showMaterialDocs.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.showMaterialDocs.detail'),
    command: 'iceworks-material-helper.showMaterialDocs',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.runDebug.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.runDebug.detail'),
    command: 'iceworksApp.editorMenu.runDebug',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.runBuild.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.runBuild.detail'),
    command: 'iceworksApp.editorMenu.runBuild',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.reinstall.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.reinstall.detail'),
    command: 'iceworksApp.nodeDependencies.reinstall',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.addDepsAndDevDeps.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.addDepsAndDevDeps.detail'),
    command: 'iceworksApp.nodeDependencies.addDepsAndDevDeps',
  },
  {
    label: i18n.format('extension.iceworksApp.showExtensionsQuickPick.openSettings.label'),
    detail: i18n.format('extension.iceworksApp.showExtensionsQuickPick.openSettings.detail'),
    command: 'iceworksApp.configHelper.start',
  },
];

export default function showExtensionsQuickPick() {
  const quickPick = window.createQuickPick();
  quickPick.items = extensionOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const currentExtension = extensionOptions.find((option) => option.label === selection[0].label)!;
      commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
