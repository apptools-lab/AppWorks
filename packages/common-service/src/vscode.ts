import * as vscode from 'vscode';
import { CONFIGURATION_SECTION } from './constants';

export function saveDataToSettingJson(section: string, data: any, configurationTarget = true): void {
  vscode.workspace.getConfiguration(CONFIGURATION_SECTION).update(section, data, configurationTarget);
}

export function getDataFromSettingJson(section: string, defaultValue?: any): any {
  return vscode.workspace.getConfiguration(CONFIGURATION_SECTION).get(section, defaultValue);
}

export function openInExternalFinder(url) {
  vscode.env.openExternal(vscode.Uri.file(url));
}

export function showTextDocument(resource: string) {
  return vscode.window.showTextDocument(vscode.Uri.file(resource));
}

export function showInformationMessage(...args) {
  // TODO Parameter type judgment
  const reset = args.length > 2 ? args.slice(0, args.length - 2) : args;
  return vscode.window.showInformationMessage.apply(null, reset);
}

export function getLanguage() {
  return vscode.env.language;
}
