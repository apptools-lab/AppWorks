import * as vscode from 'vscode';
import * as path from 'path';
import axios from 'axios';
import { officialMaterialSources } from './constants';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('projectCreator.start', () => {
			const panel = vscode.window.createWebviewPanel(
				'react',
				'Create Project',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
				}
			);

			panel.webview.html = getWebviewContent(context.extensionPath);

			panel.webview.onDidReceiveMessage(async message => {
				if (message.command === 'openFolderDialog') {
					const options: vscode.OpenDialogOptions = {
						canSelectFolders: true,
						canSelectFiles: false,
						canSelectMany: false,
						openLabel: 'Open',
					};
					const selectUri = await vscode.window.showOpenDialog(options);
					const { fsPath } = selectUri[0];
					panel.webview.postMessage({ command: 'onGetProjectPath', projectPath: fsPath });
				}

				if (message.command === 'getScaffolds') {
					const scaffolds = {};
					const sourcesKeys = Object.keys(officialMaterialSources);
					for (let key of sourcesKeys) {
						try {
							const response = await axios.get(officialMaterialSources[key]);
							scaffolds[key] = response.data.scaffolds;
						} catch (e) {
							scaffolds[key] = [];
						}
					}
					panel.webview.postMessage({ command: 'onGetScaffolds', scaffolds });
				}

			}, undefined, context.subscriptions);
		})
	);
}

function getWebviewContent(extensionPath: string) {
	const basePath = path.join(extensionPath, 'out/assets/');

	const scriptPathOnDisk = vscode.Uri.file(path.join(basePath, 'js/index.js'));
	const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
	const stylePathOnDisk = vscode.Uri.file(path.join(basePath, 'css/index.css'));
	const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });
	// Use a nonce to whitelist which scripts can be run
	const nonce = getNonce();
	return (
		`<!DOCTYPE html>
			<html lang="en">
			<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta name="theme-color" content="#000000">
					<title>iceworks Project Creator</title>
					<link rel="stylesheet" type="text/css" href="${styleUri}">
			</head>
			<body>
					<div id="ice-container"></div>
					<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>
		`
	);
}

function getNonce(): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
