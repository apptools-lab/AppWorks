import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import { NpmScriptsProvider, Script } from './views/npmScriptsView';
import { DepNodeProvider, DependencyNode, setPackageManager, setNpmRegister, addDepCommandHandler } from './views/nodeDependenciesView';
import { ComponentsProvider } from './views/componentsView';
import { PagesProvider } from './views/pagesView';
import { ITerminalMap } from "./types";
import { openEntryFile, executeCommand } from './utils';

export function activate(context: vscode.ExtensionContext) {
	const rootPath = vscode.workspace.rootPath;

	if (!rootPath) {
		vscode.window.showInformationMessage('The root path is empty. Please open a project or create a project.');
		return;
	}

	const terminals: ITerminalMap = new Map<string, Terminal>();

	vscode.window.onDidCloseTerminal(term => terminals.delete(term.name));

	const npmScriptsProvider = new NpmScriptsProvider(rootPath);
	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
	vscode.commands.registerCommand('iceworksMain.npmScripts.executeCommand', (script: Script) => executeCommand(terminals, script.command!));
	vscode.commands.registerCommand('iceworksMain.npmScripts.refresh', () => npmScriptsProvider.refresh());

	const componentsProvider = new ComponentsProvider(rootPath);
	vscode.window.registerTreeDataProvider('components', componentsProvider);
	vscode.commands.registerCommand('iceworksMain.components.add', () => { });
	vscode.commands.registerCommand('iceworksMain.components.refresh', () => componentsProvider.refresh());
	vscode.commands.registerCommand('iceworksMain.components.openFile', (p) => openEntryFile(p));

	const pagesProvider = new PagesProvider(rootPath);
	vscode.window.registerTreeDataProvider('pages', pagesProvider);
	vscode.commands.registerCommand('iceworksMain.pages.add', () => { });
	vscode.commands.registerCommand('iceworksMain.pages.refresh', () => pagesProvider.refresh());
	vscode.commands.registerCommand('iceworksMain.pages.openFile', (p) => openEntryFile(p));

	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('iceworksMain.nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('iceworksMain.nodeDependencies.upgrade', (node: DependencyNode) => executeCommand(terminals, node.command!));
	vscode.commands.registerCommand('iceworksMain.nodeDependencies.install', () => {
		const script = nodeDependenciesProvider.getInstallScript();
		executeCommand(terminals, script!);
	});
	vscode.commands.registerCommand('iceworksMain.nodeDependencies.reinstall', async () => {
		const script = await nodeDependenciesProvider.getReinstallScript();
		executeCommand(terminals, script!);
	});

	context.subscriptions.push(vscode.commands.registerCommand('iceworksMain.nodeDependencies.addDependency', () => addDepCommandHandler(terminals, nodeDependenciesProvider)));
	context.subscriptions.push(vscode.commands.registerCommand('iceworksMain.nodeDependencies.setPackageManager', setPackageManager));
	context.subscriptions.push(vscode.commands.registerCommand('iceworksMain.nodeDependencies.setNpmRegister', setNpmRegister));
}
