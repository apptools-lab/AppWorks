import * as vscode from 'vscode';
import { ALI_FUSION_MATERIAL_URL, ALI_NPM_REGISTRY } from '@appworks/constant';
import { CONFIGURATION_KEY_MATERIAL_SOURCES, CONFIGURATION_KEY_NPM_REGISTRY, CONFIGURATION_KEY_PACKAGE_MANAGER, CONFIGURATION_SECTION_MATERIAL_SOURCES, CONFIGURATION_SECTION_NPM_REGISTRY, CONFIGURATION_SECTION_PACKAGE_MANAGER, didShowWelcomePageStateKey } from './constants';
import { checkAliInternal } from 'ice-npm-utils';
import { getDataFromSettingJson, saveDataToSettingJson } from './vscode';
import { setLastActiveTextEditorId } from './editor';
import { checkIsAliInternal } from './env';

export async function initExtension(context: vscode.ExtensionContext) {
  const { globalState } = context;

  await autoInitMaterialSource(globalState);

  await autoSetNpmConfiguration(globalState);

  await autoSetContext();

  // autoStartWelcomePage(globalState);

  onChangeActiveTextEditor(context);
}

async function autoSetContext() {
  vscode.commands.executeCommand('setContext', 'appworks:isAliInternal', await checkIsAliInternal());
}

/**
 * Compatible:
 * If there is an official material source, remove it.
 * The official material source will be added automatically when it is obtained.
 */
const didSetMaterialSourceStateKey = 'appworks.materialSourceIsSet';
async function autoInitMaterialSource(globalState: vscode.Memento) {
  const materialSourceIsSet = globalState.get(didSetMaterialSourceStateKey);
  if (!materialSourceIsSet) {
    const materialSources = getDataFromSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES);
    const officalMaterialSources = [
      'http://ice.alicdn.com/assets/materials/react-materials.json',
      ALI_FUSION_MATERIAL_URL,
    ];
    const newSources = Array.isArray(materialSources) ? materialSources.filter(
      (materialSource) => !officalMaterialSources.includes(materialSource.source),
    ) : [];
    saveDataToSettingJson(CONFIGURATION_KEY_MATERIAL_SOURCES, newSources);
  }

  vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
    const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_MATERIAL_SOURCES);
    if (isTrue) {
      globalState.update(didSetMaterialSourceStateKey, true);
    }
  });
}

function onChangeActiveTextEditor(context: vscode.ExtensionContext) {
  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      if (editor) {
        const { fsPath } = editor.document.uri;
        const isJSXFile = fsPath.match(/^.*\.(jsx?|tsx)$/g);
        vscode.commands.executeCommand('setContext', 'appworks:isJSXFile', isJSXFile);

        // save active text editor id
        const { id } = editor as any;
        console.log('activeTextEditor Id', id);
        setLastActiveTextEditorId(id);
      }
    },
    null,
    context.subscriptions,
  );
}

async function autoStartWelcomePage(globalState: vscode.Memento) {
  const didShowWelcomePage = globalState.get(didShowWelcomePageStateKey);

  // if didSetMaterialSource means is installed
  const isFirstInstall = !didShowWelcomePage && !globalState.get(didSetMaterialSourceStateKey);
  if (isFirstInstall && !vscode.window.activeTextEditor && vscode.extensions.getExtension('iceworks-team.iceworks-app')) {
    vscode.commands.executeCommand('applicationManager.welcome.start');
  }
  globalState.update(didShowWelcomePageStateKey, true);
}

async function autoSetNpmConfiguration(globalState: vscode.Memento) {
  const isAliInternal = await checkAliInternal();
  autoSetPackageManagerConfiguration(globalState, isAliInternal);
  autoSetNpmRegistryConfiguration(globalState, isAliInternal);
}

async function autoSetPackageManagerConfiguration(globalState: vscode.Memento, isAliInternal: boolean) {
  console.log('autoSetPackageManager: run');

  const stateKey = 'appworks.packageManagerIsSeted';
  const packageManagerIsSelected = globalState.get(stateKey);
  if (!packageManagerIsSelected && isAliInternal) {
    console.log('autoSetPackageManager: do');
    saveDataToSettingJson(CONFIGURATION_KEY_PACKAGE_MANAGER, 'tnpm');
  }

  vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
    const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_PACKAGE_MANAGER);
    if (isTrue) {
      console.log('autoSetPackageManager: did change');

      globalState.update(stateKey, true);
    }
  });
}

async function autoSetNpmRegistryConfiguration(globalState: vscode.Memento, isAliInternal: boolean) {
  console.log('autoSetNpmRegistry: run');

  const stateKey = 'appworks.npmRegistryIsSeted';
  const npmRegistryIsSelected = globalState.get(stateKey);
  if (!npmRegistryIsSelected && isAliInternal) {
    console.log('autoSetNpmRegistry: do');
    saveDataToSettingJson(CONFIGURATION_KEY_NPM_REGISTRY, ALI_NPM_REGISTRY);
  }

  vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
    const isTrue = event.affectsConfiguration(CONFIGURATION_SECTION_NPM_REGISTRY);
    if (isTrue) {
      console.log('autoSetNpmRegistry: did change');

      globalState.update(stateKey, true);
    }
  });
}
