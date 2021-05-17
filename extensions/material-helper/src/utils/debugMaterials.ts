import { CONFIGURATION_KEY_MATERIAL_SOURCES, getDataFromSettingJson, saveDataToSettingJson, registerCommand } from '@appworks/common-service';
import { material } from '@appworks/material-engine';
import { getFolderPath } from '@appworks/project-service';
import * as vscode from 'vscode';
import i18n from '../i18n';

const { addSource, generateDebugMaterialData, DEBUG_PREFIX, isDebugSource } = material;

const debugQuickPicks: any[] = [
  {
    label: i18n.format('extension.iceworksMaterialHelper.debugMaterial.addMaterial.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.debugMaterial.addMaterial.detail'),
    command: 'appworks-material-helper.debug-materials.addMaterial',
  },
  {
    label: i18n.format('extension.iceworksMaterialHelper.debugMaterial.deleteMaterial.label'),
    detail: i18n.format('extension.iceworksMaterialHelper.debugMaterial.deleteMaterial.detail'),
    command: 'appworks-material-helper.debug-materials.deleteSource',
  },
];

export function registerDebugCommand(subscriptions) {
  subscriptions.push(
    registerCommand('appworks-material-helper.debug-materials.start', () => {
      initDebugMaterials();
    }),
  );
  subscriptions.push(
    registerCommand('appworks-material-helper.debug-materials.addMaterial', () => {
      addDebugMaterials();
    }),
  );
  subscriptions.push(
    registerCommand('appworks-material-helper.debug-materials.deleteSource', () => {
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
  const materialPath = await getFolderPath(i18n.format('extension.iceworksMaterialHelper.debugMaterial.addMaterial.openLabel'));
  if (materialPath) {
    try {
      const debugMaterial = await generateDebugMaterialData(materialPath);
      await addSource({
        name: debugMaterial.name,
        type: debugMaterial.type,
        source: `${DEBUG_PREFIX}${materialPath}`,
        official: false,
        checked: false,
        description: `${DEBUG_PREFIX}${materialPath}`,
        isEditing: false,
      });
      vscode.window.showInformationMessage(i18n.format('extension.iceworksMaterialHelper.debugInput.addSourceSuccess'));
    } catch (err) {
      vscode.window.showErrorMessage(i18n.format('extension.iceworksMaterialHelper.initDebug.err', { errMessage: err.message }));
    }
  }
}

export async function deleteAllDebugSources() {
  const materialsSource = await getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const adjustedMaterialsSource = materialsSource.filter(item => !isDebugSource(item.source));
  await saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, adjustedMaterialsSource);
  vscode.window.showInformationMessage(i18n.format('extension.iceworksMaterialHelper.debugInput.deleteSourceSuccess'));
}
