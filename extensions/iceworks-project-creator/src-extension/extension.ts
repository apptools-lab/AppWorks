import * as vscode from 'vscode';
import * as path from 'path';

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
