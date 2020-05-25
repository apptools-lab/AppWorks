import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import { NpmScriptsProvider, Script } from './npmScripts';
import { DepNodeProvider, Dependency } from './nodeDenpendencies';
import { ComponentsProvider } from './components';
import { PagesProvider } from './pages';
import { executeCommand } from './executeCommand';
import { ITerminalMap } from "./types";
import { openEntryFile } from './utils';

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
	vscode.commands.registerCommand('npmScripts.executeCommand', (script: Script) => executeCommand(terminals, script));
	vscode.commands.registerCommand('npmScripts.refresh', () => npmScriptsProvider.refresh());

	const componentsProvider = new ComponentsProvider(rootPath);
	vscode.window.registerTreeDataProvider('components', componentsProvider);
	vscode.commands.registerCommand('components.add', () => { });
	vscode.commands.registerCommand('components.refresh', () => componentsProvider.refresh());
	vscode.commands.registerCommand('components.openFile', (p) => openEntryFile(p));

	const pagesProvider = new PagesProvider(rootPath);
	vscode.window.registerTreeDataProvider('pages', pagesProvider);
	vscode.commands.registerCommand('pages.add', () => { });
	vscode.commands.registerCommand('pages.refresh', () => pagesProvider.refresh());
	vscode.commands.registerCommand('pages.openFile', (p) => openEntryFile(p));


	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('nodeDependencies.refresh', () => nodeDependenciesProvider.refresh());
	vscode.commands.registerCommand('nodeDependencies.upgrade', (node: Dependency) => executeCommand(terminals, node));
	vscode.commands.registerCommand('nodeDependencies.install', () => executeCommand(terminals, nodeDependenciesProvider.install()));
	vscode.commands.registerCommand('nodeDependencies.reinstall', () => executeCommand(terminals, nodeDependenciesProvider.reinstall()));
}
