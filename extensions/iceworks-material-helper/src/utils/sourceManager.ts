/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import { IMaterialData, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import { getSourcesByProjectType, getData } from '@iceworks/material-service';
import { window } from 'vscode';
import { recordDAU } from '@iceworks/recorder';
import { IQuickPickInfo } from '../getDocsForMaterials/type';
import { openInExternalBrowser } from '../getDocsForMaterials/openInBowser';

const source = {
  quickPickInfo: [] as IQuickPickInfo[],
  docsCommand: {},
};
let loading = true;

export function getSource(sourceName: string) {
  if (!loading) return source[sourceName];
  else window.showInformationMessage('Source Loading... Try again later.');
}

export async function initSource() {
  source.quickPickInfo = await createQuickPickInfo();
  loading = false;
}

async function createQuickPickInfo() {
  const getQuickPickInfoFromData = (sourceJson: IMaterialData) => {
    return [...sourceJson.components, ...(sourceJson.bases || [])].map((e: IMaterialComponent | IMaterialBase) => {
      createDocsCommand(e.homepage);
      return {
        label: e.name,
        detail: e.title,
        description: e['description'] || '',
        homepage: e.homepage,
      };
    });
  };

  const ProjectMaterialSources = await getSourcesByProjectType();
  const materialData = Promise.all(ProjectMaterialSources.map(({ source }) => getData(source)));
  return (await materialData).reduce((quickPickInfos, data) => {
    return quickPickInfos.concat(getQuickPickInfoFromData(data));
  }, [] as IQuickPickInfo[]);
}

function createDocsCommand(url: string) {
  const docsCommand = `iceworks:material-helper.openDocUrl:${url}`;
  source.docsCommand[url] = docsCommand;
  vscode.commands.registerCommand(docsCommand, () => {
    console.log(docsCommand);
    openInExternalBrowser(url);
    recordDAU();
  });
  console.log('commandRegister',docsCommand);
}
