import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as _ from 'lodash';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;
const buildJsonUri = `${vscode.workspace.rootPath}/build.json`;

let lastBuildJsonFromWebview = {};
let webviewLoading = true;

export function clearCache() {
  webviewLoading = true;
  lastBuildJsonFromWebview = {};
}
// 检测是否是配置文件
export function isBuildJson(document: vscode.TextDocument) {
  return document.uri.fsPath.endsWith('build.json');
}

// 向网页端更新 JSON
export function updateJsonForWeb(content: string | undefined, panel?: vscode.WebviewPanel) {
  const formcontent = content || fse.readFileSync(buildJsonPath, 'utf-8');
  let jsonContent;
  if (!panel || _.isEqual(JSON.parse(formcontent), lastBuildJsonFromWebview)) {
    return;
  }
  try {
    jsonContent = JSON.parse(formcontent);
  } catch {
    return;
  }
  console.log('jsonForWebview', jsonContent);
  panel.webview.postMessage({ buildJson: jsonContent });
}

// 向文件中更新 Json
export function updateJsonFile(message, webviewPanel?: vscode.WebviewPanel): void {
  console.log('message', message);
  console.log('webviewLoading', webviewLoading);
  // 收到网页初始化完成的消息后，发送当前 json 信息给 webview
  if (webviewLoading && message === 'iceworks-config-helper:webviewLoadingDone') {
    updateJsonForWeb(undefined, webviewPanel);
    webviewLoading = false;
  } else if (!webviewLoading) {
    let { buildJson } = message;
    lastBuildJsonFromWebview = buildJson;
    // 如果有打开的 buildJson 编辑器，则直接使用此编辑器而并非写入文件。
    const buildJsonEditer = findBuildJsonEditor('build.json');
    // <EditInJson>添加默认属性
    if (buildJson.value !== undefined) {
      // if(!buildJsonEditer) vscode.window.showTextDocument(buildJsonUri);
      const currentBuidJson = buildJsonEditer
        ? JSON.parse(buildJsonEditer.document.getText())
        : fse.readJSONSync(buildJsonPath);
      currentBuidJson[buildJson.name] = currentBuidJson[buildJson.name] || buildJson.value;
      buildJson = currentBuidJson;
    }

    if (buildJsonEditer) {
      const end = new vscode.Position(buildJsonEditer.document.lineCount + 1, 0);
      buildJsonEditer.edit((editor) => {
        editor.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(buildJson, null, '\t'));
      });
    } else {
      fse.writeFile(buildJsonPath, JSON.stringify(buildJson, null, '\t'), (err) => {
        console.log(err);
      });
    }
  }
}

// WebView Finder
// TODO: 将它变得更加普适
export function findBuildJsonEditor(fileName: string) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.path.endsWith(fileName);
  });
}
