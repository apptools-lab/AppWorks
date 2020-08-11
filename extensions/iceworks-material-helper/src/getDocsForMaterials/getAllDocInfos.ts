/* eslint-disable dot-notation */
import * as vscode from 'vscode';
import { IMaterialData as IMaterialInfo, IMaterialComponent, IMaterialBase } from '@iceworks/material-utils';
import { getSourcesByProjectType, getData } from '@iceworks/material-service';
import { window } from 'vscode';
import { recordDAU } from '@iceworks/recorder';
import { IMaterialDocInfo } from './type';
import { openInBrowser } from './openInBowser';

let loading = true;
let docInfoCache: IMaterialDocInfo[] = [];
export function getAllDocInfos(): IMaterialDocInfo[] {
  if (!loading) {
    return docInfoCache;
  } else {
    window.showInformationMessage('Source Loading... Try again later.');
    return [];
  }
}

export async function initSource() {
  docInfoCache = await getDocInfos();
  loading = false;
}

async function getDocInfos() {
  const getDocInfoFromMaterial = (sourceJson: IMaterialInfo) => {
    return [...sourceJson.components, ...(sourceJson.bases || [])].map((e: IMaterialComponent | IMaterialBase) => {
      return {
        label: e.name,
        detail: e.title,
        description: e['description'] || '',
        url: e.homepage,
        command: getDocInfoCommand(e.homepage),
      };
    });
  };

  const projectSource = await getSourcesByProjectType();
  const materialInfos = Promise.all(projectSource.map(({ source }) => getData(source)));
  return (await materialInfos).reduce((materialDocInfos, materialInfo) => {
    return materialDocInfos.concat(getDocInfoFromMaterial(materialInfo));
  }, [] as IMaterialDocInfo[]);
}

function getDocInfoCommand(url: string) {
  const command = `iceworks:material-helper.openDocUrl:${url}`;
  vscode.commands.registerCommand(command, () => {
    console.log(command);
    openInBrowser(url);
    recordDAU();
  });
  return command;
}
