import * as vscode from 'vscode';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import services from './services/index';
import axios from 'axios'

const { window, ViewColumn } = vscode;

export function activate(context: vscode.ExtensionContext) {
	const { extensionPath, subscriptions } = context;

	axios.get('https://api.def.alibaba-inc.com/api/generator/generator/task/6003', {
		params: {
			'need_generator': true,
			'client_token': '8ea74f33dea670f4bfc99092cea1314e953e3c1a4b8b6b60c48384543114a4e8'
		}
	})
		.then((res) => { console.log(res) })
		.catch((err) => console.error(err))

	function activeWebview() {
		const webviewPanel: vscode.WebviewPanel = window.createWebviewPanel('iceworks', 'Create Project', ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});
		webviewPanel.webview.html = getHtmlForWebview(extensionPath);
		connectService(webviewPanel.webview, subscriptions, services);
	}

	context.subscriptions.push(vscode.commands.registerCommand('iceworks-project-creator.start', function () {
		activeWebview();
	}));
}
