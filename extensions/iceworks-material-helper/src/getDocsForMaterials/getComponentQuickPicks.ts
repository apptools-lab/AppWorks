/* eslint-disable dot-notation */
import { getSourcesByProjectType, getData } from '@iceworks/material-service';
import * as vscode from 'vscode';
import { IMaterialData, IMaterialComponent, IMaterialScaffold, IMaterialBase } from '@iceworks/material-utils';

const getQuickPickInfo = async () => {
  const getQuickPickInfoFromData = (sourceJson: IMaterialData) => {
    return [...sourceJson.components, ...sourceJson.scaffolds, ...(sourceJson.bases || [])].map(
      (e: IMaterialComponent | IMaterialScaffold | IMaterialBase) => {
        return {
          label: e.name,
          detail: e.title,
          description: e['description'] || '',
          homepage: e.homepage,
        };
      }
    );
  };

  const quickPickInfos: any[] = [];
  const ProjectMaterialSources = await getSourcesByProjectType();
  const materialData = Promise.all(ProjectMaterialSources.map(({ source }) => getData(source)));
  (await materialData).forEach((data) => {
    quickPickInfos.push(...getQuickPickInfoFromData(data));
  });
  return quickPickInfos;
};

export default async function showMaterialQuickPicks() {
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = await getQuickPickInfo();
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      vscode.env.openExternal(selection[0]['homepage']);
      quickPick.dispose();
    }
  });
  quickPick.show();
}
