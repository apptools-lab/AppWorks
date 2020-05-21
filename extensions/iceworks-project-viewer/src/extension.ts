import * as vscode from 'vscode';
import { NpmScriptsProvider, Script } from './npmScripts';
import { DepNodeProvider } from './nodeDenpendencies';
import { ComponentsProvider } from './components';
import { PagesProvider } from './pages';

export function activate(context: vscode.ExtensionContext) {
	const npmScriptsProvider = new NpmScriptsProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('npmScripts', npmScriptsProvider);
	vscode.commands.registerCommand('npmScripts.runEntry', (node: Script) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
	vscode.commands.registerCommand('npmScripts.refreshEntry', () => { });

	const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));
	vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => { });

	const componentsProvider = new ComponentsProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('components', componentsProvider);
	vscode.commands.registerCommand('components.addEntry', () => { });

	const pagesProvider = new PagesProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('pages', pagesProvider);
	vscode.commands.registerCommand('pages.addEntry', () => { });
}
