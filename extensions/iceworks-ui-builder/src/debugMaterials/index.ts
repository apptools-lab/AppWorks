import { CONFIGURATION_KEY_MATERIAL_SOURCES, getDataFromSettingJson, saveDataToSettingJson, registerCommand } from '@iceworks/common-service';
import { addSource, generateDebugMaterialJson, DEBUG_PREFIX } from '@iceworks/material-service';
import * as vscode from 'vscode';

const debugQuickPicks : any[] = [
  {
    label: '添加或更新一个物料源信息',
    detail: '输入物料项目的路径以新增或更新物料源',
    command: 'iceworks-ui-builder.debug-materials.addMaterial',
  },
  {
    label: '删除调试物料源',
    detail: '删除设置中的调试物料项目',
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
      showDebugInputBox();
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

async function showDebugInputBox() {
  const materialPath = await vscode.window.showInputBox({
    placeHolder: '/path/to/materials',
    prompt: 'Input Material Folder Path',
  });
  if (materialPath) {
    try {
      const debugMaterial = await generateDebugMaterialJson(materialPath);
      await addSource({
        name: debugMaterial.name,
        type: debugMaterial.type,
        source: `${DEBUG_PREFIX}${materialPath}`,
        official: false,
        checked: false,
        description: `DEBUG:${materialPath}`,
        isEditing: false,
      });
      return debugMaterial.name;
    } catch (err) {
      vscode.window.showErrorMessage(`init Debug Err ${err.message}`);
    }
  }
}

export async function deleteAllDebugSources() {
  const materialsSource = await getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
  const adjustedMaterialsSource = materialsSource.filter(item => item.name.startsWith(`$$${DEBUG_PREFIX}`));
  await saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, adjustedMaterialsSource);
}

