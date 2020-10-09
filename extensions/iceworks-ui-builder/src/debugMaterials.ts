import { CONFIGURATION_KEY_MATERIAL_SOURCES, getDataFromSettingJson, saveDataToSettingJson, registerCommand } from '@iceworks/common-service';
import { addSource, generateDebugMaterialJson, DEBUG_PREFIX } from '@iceworks/material-service';
import { getFolderPath } from '@iceworks/project-service';
import * as vscode from 'vscode';
import i18n from './i18n';

const debugQuickPicks: any[] = [
  {
    label: i18n.format('extension.iceworksUIBuilder.debugMaterial.addMaterial.label'),
    detail: i18n.format('extension.iceworksUIBuilder.debugMaterial.addMaterial.detail'),
    command: 'iceworks-ui-builder.debug-materials.addMaterial',
  },
  {
    label: i18n.format('extension.iceworksUIBuilder.debugMaterial.deleteMaterial.label'),
    detail: i18n.format('extension.iceworksUIBuilder.debugMaterial.deleteMaterial.detail'),
    command: 'iceworks-ui-builder.debug-materials.deleteSource',
  },
];

export function registerDebugCommand(subscriptions) {
  subscriptions.push(
    registerCommand('iceworks-ui-builder.debug-materials', () => {
      initDebugMaterials();
    }),
  );
  subscriptions.push(
    registerCommand('iceworks-ui-builder.debug-materials.addMaterial', () => {
      addDebugMaterials();
    }),
  );
  subscriptions.push(
    registerCommand('iceworks-ui-builder.debug-materials.deleteSource', () => {
      deleteAllDebugSources();
    }),
  );
}

export async function initDebugMaterials() {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = debugQuickPicks;
  quickPick.onDidChangeSelection(item => {
    quickPick.dispose();
    // @ts-ignore
    vscode.commands.executeCommand(item[0].command);
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

async function addDebugMaterials() {
  const materialPath = await getFolderPath(i18n.format('extension.iceworksUIBuilder.debugMaterial.addMaterial.openLabel'));
  if (materialPath) {
    try {
      const debugMaterial = await generateDebugMaterialJson(materialPath);
      await addSource({
        name: debugMaterial.name,
        type: debugMaterial.type,
        source: `${DEBUG_PREFIX}${materialPath}`,
        official: false,
        checked: false,
        description: `${DEBUG_PREFIX}${materialPath}`,
        isEditing: false,
      });
      vscode.window.showInformationMessage(i18n.format('extension.iceworksUIBuilder.debugInput.addSourceSuccess'));
    } catch (err) {
      vscode.window.showErrorMessage(i18n.format('extension.iceworksUIBuilder.initDebug.err', { errMessage: err.message }));
    }
  }
}

export async function deleteAllDebugSources() {
  const materialsSource = await getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const adjustedMaterialsSource = materialsSource.filter(item => item.name.startsWith(`$$${DEBUG_PREFIX}`));
  await saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, adjustedMaterialsSource);
  vscode.window.showInformationMessage(i18n.format('extension.iceworksUIBuilder.debugInput.deleteSourceSuccess'));
}

