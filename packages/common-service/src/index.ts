import { checkAliInternal } from 'ice-npm-utils';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';
import * as path from 'path';

export const CONFIGURATION_SECTION = 'iceworks';
export const CONFIGURATION_KEY_PCKAGE_MANAGER = 'packageManager';
export const CONFIGURATION_KEY_NPM_REGISTRY = 'npmRegistry';
export const CONFIGURATION_SECTION_PCKAGE_MANAGER = `${CONFIGURATION_SECTION}.${CONFIGURATION_KEY_PCKAGE_MANAGER}`;
export const CONFIGURATION_SECTION_NPM_REGISTRY = `${CONFIGURATION_SECTION}.${CONFIGURATION_KEY_NPM_REGISTRY}`;

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
  vscode.workspace.getConfiguration(CONFIGURATION_SECTION).update(section, data, configurationTarget);
}

export function getDataFromSettingJson(section: string): string {
  return vscode.workspace.getConfiguration(CONFIGURATION_SECTION).get(section);
}

export function executeCommand(...arg: any[]) {
  return vscode.commands.executeCommand.apply(null, arg);
}

export async function setPackageManager(packageManagers: string[]): Promise<void> {
  const quickPick = vscode.window.createQuickPick();

  quickPick.items = packageManagers.map(label => ({ label }));
  quickPick.onDidChangeSelection(async selection => {
    if (selection[0]) {
      saveDataToSettingJson(CONFIGURATION_KEY_PCKAGE_MANAGER, selection[0].label);
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
        vscode.commands.executeCommand('workbench.action.openSettings', CONFIGURATION_SECTION_NPM_REGISTRY);
      } else {
        saveDataToSettingJson(CONFIGURATION_KEY_NPM_REGISTRY, selection[0].label);
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
  return packageJson.contributes.configuration.properties[CONFIGURATION_SECTION_PCKAGE_MANAGER].enum;
}

export function getNpmRegistriesDefaultFromPckageJson(packageJsonPath: string): string[] {
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.contributes.configuration.properties[CONFIGURATION_SECTION_NPM_REGISTRY].enum;
}

export async function autoSetNpmConfiguration(globalState: vscode.Memento) {
  const isAliInternal = await checkAliInternal();
  autoSetPackageManagerConfiguration(globalState, isAliInternal);
  autoSetNpmRegistryConfiguration(globalState, isAliInternal);
}

async function autoSetPackageManagerConfiguration(globalState: vscode.Memento, isAliInternal: boolean) {
  console.log('autoSetPackageManager: run');

  const stateKey = 'iceworks.packageManagerIsSeted';
  const packageManagerIsSeted = globalState.get(stateKey);
  if (!packageManagerIsSeted && isAliInternal) {
    console.log('autoSetPackageManager: do');
    saveDataToSettingJson(CONFIGURATION_KEY_PCKAGE_MANAGER, 'tnpm');
  }

  vscode.workspace.onDidChangeConfiguration(function(event: vscode.ConfigurationChangeEvent) {
    const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_PCKAGE_MANAGER);
    if (isTrue) {
      console.log('autoSetPackageManager: did change');

      globalState.update(stateKey, true);
    }
  });
}

async function autoSetNpmRegistryConfiguration(globalState: vscode.Memento, isAliInternal: boolean) {
  console.log('autoSetNpmRegistry: run');

  const stateKey = 'iceworks.npmRegistryIsSeted';
  const npmRegistryIsSeted = globalState.get(stateKey);
  if (!npmRegistryIsSeted && isAliInternal) {
    console.log('autoSetNpmRegistry: do');
    saveDataToSettingJson(CONFIGURATION_KEY_NPM_REGISTRY, 'https://registry.npm.alibaba-inc.com');
  }

  vscode.workspace.onDidChangeConfiguration(function(event: vscode.ConfigurationChangeEvent) {
    const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_NPM_REGISTRY);
    if (isTrue) {
      console.log('autoSetNpmRegistry: did change');

      globalState.update(stateKey, true);
    }
  });
}
