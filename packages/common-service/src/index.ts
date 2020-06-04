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

export async function setPackageManager(packageManagers: string[]): Promise<void> {
  const quickPick = vscode.window.createQuickPick();

  quickPick.items = packageManagers.map(label => ({ label }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      await vscode.workspace.getConfiguration().update('iceworks.packageManager', selection[0].label, true);
      vscode.window.showInformationMessage(`Setting ${selection[0].label} client successfully!`);
      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

export async function setNpmRegistry(npmRegistrys: string[]): Promise<void> {
  const quickPick = vscode.window.createQuickPick();

  const addOtherRegistryLabel = 'Add Other Registry...';
  quickPick.items = [...npmRegistrys, addOtherRegistryLabel].map(label => ({ label }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      if (selection[0].label === addOtherRegistryLabel) {
        vscode.commands.executeCommand('workbench.action.openSettings', 'iceworks.npmRegistry');
      } else {
        await vscode.workspace.getConfiguration().update('iceworks.npmRegistry', selection[0].label, true);
        vscode.window.showInformationMessage(`Setting ${selection[0].label} Registry successfully!`);
      }

      quickPick.hide();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
};

export function getPackageManagersDefaultFromPackageJson(packageJsonPath: string): string[] {
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.contributes.configuration.properties['iceworks.packageManager'].enum;
}

export function getNpmRegistriesDefaultFromPckageJson(packageJsonPath: string): string[] {
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.contributes.configuration.properties['iceworks.npmRegistry'].enum;
}
