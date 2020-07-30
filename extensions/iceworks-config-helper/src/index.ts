import * as vscode from 'vscode';
import { getProjectFramework } from '@iceworks/project-service';
import { connectService, getHtmlForWebview } from '@iceworks/vscode-webview/lib/vscode';
import { initExtension, Logger } from '@iceworks/common-service';
import services from './services/index';
import { loadJson, isBuildJson, updateJson, updateJsonFile } from './loadJson';

// eslint-disable-next-line
const { name, version } = require('../package.json');

async function setSourceJSON(){
  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach(extension => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (
        packageJSON && packageJSON.contributes &&
        (projectFramework === 'rax-app' || projectFramework === 'icejs')
      ) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.json`;
      }
    });

  } catch (e) {
    // ignore
  }
}

export async function activate(context: vscode.ExtensionContext) {

  await setSourceJSON();
  const { extensionPath, subscriptions, globalState } = context;
  const webextensionPath = `${extensionPath}/web`;
  // data collection
  const logger = new Logger(name, globalState);

  // auto set configuration
  initExtension(context);

  let webviewPanel: vscode.WebviewPanel | undefined;

  function activeWebview(){
    logger.recordMainDAU();
    logger.recordExtensionActivate(version);
    if(webviewPanel){
      webviewPanel.reveal();
    } else {
      webviewPanel = vscode.window.createWebviewPanel('iceworks','Config helper - Iceworks',vscode.ViewColumn.Two,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        });
      webviewPanel.webview.html = getHtmlForWebview(webextensionPath);
      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined;
        },
        null,
        context.subscriptions
      );
      webviewPanel.webview.onDidReceiveMessage(message=>{
        console.log(message)
        updateJsonFile(message);
      },undefined,context.subscriptions)
      connectService(webviewPanel, context, { services, logger})
    }
  }

  subscriptions.push(vscode.commands.registerCommand('iceworks-config-helper.start', ()=>{
    activeWebview();
  }));

  subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event)=>{
      if(isBuildJson(event.document)){
        updateJson(event.document.getText(),webviewPanel)
      }
    })
  )

  console.log('confighelper active');
  const stateKey = 'iceworks.configHelper.autoActivedWebview';
  if (!globalState.get(stateKey)) {
    activeWebview();
    globalState.update(stateKey, true);
  }
};


