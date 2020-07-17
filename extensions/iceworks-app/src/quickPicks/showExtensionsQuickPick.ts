import * as vscode from 'vscode';

import * as zhCNTextMap from '../locales/zh-CN.json';
import * as enUSTextMap from '../locales/en-US.json';
const { window, commands } = vscode;

import i18n from '@iceworks/i18n';


i18n.registry("zh-CN",zhCNTextMap);
i18n.registry("en",enUSTextMap);

i18n.setLocal(vscode.env.language);
import { createApplicationLabel, createApplicationDetail } from '../locales/localString';
const extensionOptions = [
  { label: createApplicationLabel,detail: createApplicationDetail, 
  command: 'iceworks-project-creator.start', },
  { label: i18n.format("extension.iceworksApp.showExtensionsQuickPick.pageBuilder.label"), 
  detail: i18n.format("extension.iceworksApp.showExtensionsQuickPick.pageBuilder.detail"), 
  command: 'iceworks-page-builder.create', },
  { label: i18n.format("extension.iceworksApp.showExtensionsQuickPick.generateComponent.label"),
   detail: i18n.format("extension.iceworksApp.showExtensionsQuickPick.generateComponent.detail"), 
   command: 'iceworks-component-builder.generate' },
  { label: i18n.format("extension.iceworksApp.showExtensionsQuickPick.materialImport.label"), 
  detail: i18n.format("extension.iceworksApp.showExtensionsQuickPick.materialImport.detail"),
  command: 'iceworks-material-import.start' },
]

export default function showExtensionsQuickPick() {
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
