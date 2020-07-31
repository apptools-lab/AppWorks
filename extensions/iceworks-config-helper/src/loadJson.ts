import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as _ from 'lodash';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;

let lastBuildJsonFromWebview = {};

export function loadJson() {
  let buildJSON;
  try {
    buildJSON = fse.readJSONSync(buildJsonPath);
  } catch (e) {
    return null;
  }
  return buildJSON;
}

// 检测是否是配置文件
export function isBuildJson(document: vscode.TextDocument) {
  return document.uri.fsPath.endsWith('build.json');
}

// 向网页端更新 JSON
export function updateJsonForWeb(content: string | undefined, panel?: vscode.WebviewPanel) {
  // if(!content){
  //   con
  // }
  content = content || fse.readFileSync(buildJsonPath, 'utf-8');
  let jsonContent;
  if (!panel || _.isEqual(JSON.parse(content), lastBuildJsonFromWebview)) {
    return;
  }
  try {
    jsonContent = JSON.parse(content);
  } catch {
    return;
  }
  console.log('jsonForWebview', jsonContent);
  panel.webview.postMessage({ buildJson: jsonContent });
}

// 向文件中更新 Json
export function updateJsonFile(message): void {
  let { buildJson } = message;
  lastBuildJsonFromWebview = buildJson;
  // 如果有打开的 buildJson 编辑器，则直接使用此编辑器而并非写入文件。
  const buildJsonEditer = findBuildJsonEditor();

  // <EditInJson>添加默认属性
  if (buildJson.value !== undefined) {
    const currentBuidJson = buildJsonEditer?.document.getText() || fse.readJSONSync(buildJsonPath);
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

// WebView Finder
// TODO: 将它变得更加普适
export function findBuildJsonEditor() {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.path.endsWith('build.json');
  });
}
