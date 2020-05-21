import * as vscode from 'vscode';
import { DepNodeProvider } from './nodeDenpendencies';
import { ComponentsProvider } from './components';

export function activate(context: vscode.ExtensionContext) {
	const nodeDependenciesProvider = new DepNodeProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));

	const componentsProvider = new ComponentsProvider(vscode.workspace.rootPath!);
	vscode.window.registerTreeDataProvider('components', componentsProvider);
}
