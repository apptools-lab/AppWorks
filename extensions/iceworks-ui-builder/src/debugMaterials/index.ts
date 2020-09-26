import { addSource, generateDebugMaterialJson, DEBUG_PREFIX } from '@iceworks/material-service';
import * as vscode from 'vscode';

// const debugQuickPicks : vscode.QuickPickItem[] = [
//   {
//     label: '添加调试物料文件夹',
//     description: '',
//   },
//   {
//     label: '编辑物料文件夹信息',
//     description: '',
//   },
//   {
//     label: '停止物料调试',
//     description: '',
//   },
// ];

export default async function initDebugMaterials() {
  await showDebugInputBox();
}

async function showDebugInputBox() {
  const result = await vscode.window.showInputBox({
    placeHolder: '/path/to/materials',
    prompt: 'Input Material Folder Path',
  });
  if (result) {
    try {
      // 检测 debug 文件夹是否是物料源文件夹。
      const debugMaterials = await generateDebugMaterialJson(result);
      await addSource({
        name: debugMaterials.name,
        type: debugMaterials.type,
        source: `${DEBUG_PREFIX}${result}`,
        official: false,
        checked: false,
        description: `DEBUG:${result}`,
        isEditing: false,
      });
    } catch (err) {
      vscode.window.showErrorMessage(`init Debug Err ${err.message}`);
    }
  }
}

