import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import * as path from 'path';
import { getProjectType } from '@iceworks/project-service';
import { setPackageManager, setNpmRegistry, getPackageManagersDefaultFromPackageJson, getNpmRegistriesDefaultFromPckageJson, autoSetNpmConfiguration } from '@iceworks/common-service';
import { NpmScriptsProvider, Script } from './views/npmScriptsView';
import { DepNodeProvider, DependencyNode, addDepCommandHandler, showDepInputBox } from './views/nodeDependenciesView';
import { ComponentsProvider } from './views/componentsView';
import { PagesProvider } from './views/pagesView';
import { ITerminalMap } from './types';
import { openEntryFile, executeCommand } from './utils';

export async function activate(context: vscode.ExtensionContext) {
  const rootPath = vscode.workspace.rootPath;

  if (!rootPath) {
    vscode.window.showInformationMessage('当前工作区为空，请打开项目或新建项目。');
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
    return;
  }
  try {
    const projectType = await getProjectType();
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', projectType === 'unknown');
  } catch (e) {
    vscode.commands.executeCommand('setContext', 'iceworks:isNotTargetProject', true);
  }

  autoSetNpmConfiguration(context.globalState);
  const terminals: ITerminalMap = new Map<string, Terminal>();

  vscode.window.onDidCloseTerminal(term => terminals.delete(term.name));

  const npmScriptsProvider = new NpmScriptsProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
  vscode.commands.registerCommand('iceworksApp.npmScripts.executeCommand', (script: Script) => executeCommand(terminals, script.command!));
  vscode.commands.registerCommand('iceworksApp.npmScripts.refresh', () => npmScriptsProvider.refresh());

  const componentsProvider = new ComponentsProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('components', componentsProvider);
  vscode.commands.registerCommand('iceworksApp.components.add', () => {
    console.log('iceworksApp: activate iceworks-component-builder.generate');
    vscode.commands.executeCommand('iceworks-component-builder.generate');
  });
  vscode.commands.registerCommand('iceworksApp.components.refresh', () => componentsProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.components.openFile', (p) => openEntryFile(p));

  const pagesProvider = new PagesProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('pages', pagesProvider);
  vscode.commands.registerCommand('iceworksApp.pages.add', () => {
    console.log('iceworksApp: activate iceworks-page-builder.create');
    vscode.commands.executeCommand('iceworks-page-builder.create');
  });
  vscode.commands.registerCommand('iceworksApp.pages.refresh', () => pagesProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.pages.openFile', (p) => openEntryFile(p));

  const nodeDependenciesProvider = new DepNodeProvider(context, rootPath);
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  vscode.commands.registerCommand('iceworksApp.nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());
  vscode.commands.registerCommand('iceworksApp.nodeDependencies.upgrade', (node: DependencyNode) => executeCommand(terminals, node.command!));
  vscode.commands.registerCommand('iceworksApp.nodeDependencies.reinstall', async () => {
    if (nodeDependenciesProvider.packageJsonExists()) {
      const script = await nodeDependenciesProvider.getReinstallScript();
      executeCommand(terminals, script!);
    }
  });

  const packageJsonPath: string = path.join(__filename, '..', '..', 'package.json');

  context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.nodeDependencies.dependencies.add', () => showDepInputBox(terminals, nodeDependenciesProvider, 'dependencies')));
  context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.nodeDependencies.devDependencies.add', () => showDepInputBox(terminals, nodeDependenciesProvider, 'devDependencies')));
  context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.nodeDependencies.addDepsAndDevDeps', () => addDepCommandHandler(terminals, nodeDependenciesProvider)));
  context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.nodeDependencies.setPackageManager', () => setPackageManager(getPackageManagersDefaultFromPackageJson(packageJsonPath))));
  context.subscriptions.push(vscode.commands.registerCommand('iceworksApp.nodeDependencies.setNpmRegistry', () => setNpmRegistry(getNpmRegistriesDefaultFromPckageJson(packageJsonPath))));
}
