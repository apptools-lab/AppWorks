import { checkAliInternal } from 'ice-npm-utils';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';
import * as path from 'path';

export async function checkIsAliInternal(): Promise<boolean> {
  const isAliInternal = await checkAliInternal();
  return isAliInternal;
}

export async function checkPathExists(p: string, folderName?: string): Promise<boolean> {
  if (folderName) {
    p = path.join(p, folderName)
  }
  return await fse.pathExists(p);
}

export function saveDataToSettingJson(section: string, data: any, configurationTarget: boolean = true): void {
  vscode.workspace.getConfiguration('iceworks').update(section, data, configurationTarget);
}

export function getDataFromSettingJson(section: string): string {
  return vscode.workspace.getConfiguration('iceworks').get(section);
}

export function executeCommand(...arg: any[]) {
  return vscode.commands.executeCommand.apply(null, arg);
}
