import * as vscode from 'vscode';
import { Terminal } from 'vscode';
import { NpmScriptsProvider, Script } from './npmScripts';
import { DepNodeProvider } from './nodeDenpendencies';
import { ComponentsProvider } from './components';
import { PagesProvider } from './pages';
import { executeCommand } from './executeCommand';
import { ITerminalMap } from "./types";

export function activate(context: vscode.ExtensionContext) {
	const rootPath: string = vscode.workspace.rootPath || './';
	const terminals: ITerminalMap = new Map<string, Terminal>();

	const npmScriptsProvider = new NpmScriptsProvider(rootPath);
	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
	vscode.commands.registerCommand('npmScripts.executeCommand', executeCommand(terminals));
	vscode.window.onDidCloseTerminal(term => terminals.delete(term.name)); vscode.commands.registerCommand('npmScripts.refreshEntry', () => { });

	const nodeDependenciesProvider = new DepNodeProvider(rootPath);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => { });

	const componentsProvider = new ComponentsProvider(rootPath);
	vscode.window.registerTreeDataProvider('components', componentsProvider);
	vscode.commands.registerCommand('components.addEntry', () => { });

	const pagesProvider = new PagesProvider(rootPath);
	vscode.window.registerTreeDataProvider('pages', pagesProvider);
	vscode.commands.registerCommand('pages.addEntry', () => { });
}
