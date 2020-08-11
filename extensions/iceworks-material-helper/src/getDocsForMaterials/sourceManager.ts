/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import { IMaterialData, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import { getSourcesByProjectType, getData, getSources } from '@iceworks/material-service';
import { window } from 'vscode';
import { recordDAU } from '@iceworks/recorder';
import { IQuickPickInfo, SourceType } from './type';
import { openInBrowser } from './openInBowser';

const source = {
  [SourceType.QUICK_PICK_INFO]: [] as IQuickPickInfo[],
  [SourceType.COMMAND]: {},
};
let loading = true;

export function getSource(sourceType: SourceType): any {
  if (!loading) return source[sourceType];
  else window.showInformationMessage('Source Loading... Try again later.');
}

export async function initSource() {
  source[SourceType.QUICK_PICK_INFO] = await createQuickPickInfo();
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
  getSources(SourceType.COMMAND)[url] = docsCommand;
  vscode.commands.registerCommand(docsCommand, () => {
    console.log(docsCommand);
    openInBrowser(url);
    recordDAU();
  });
  // console.log(SourceType.COMMAND,docsCommand);
}
