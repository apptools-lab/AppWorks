import * as vscode from 'vscode';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { features } from 'process';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;
const buildJsonUri = vscode.Uri.file(`${vscode.workspace.rootPath}/build.json`);

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
export function updateJsonForWeb(content: string, panel?: vscode.WebviewPanel) {
  let jsonContent;
  if (!panel) {
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
export function updateJsonFile(message) {
  let { buildJson } = message;
  console.log('buildJson', buildJson);

  // <EditInJson>添加默认属性
  if (buildJson.value !== undefined) {
    const currentBuidJson = fse.readJSONSync(buildJsonPath);
    currentBuidJson[buildJson.name] = currentBuidJson[buildJson.name] || buildJson.value;
    buildJson = currentBuidJson;
  }

  // format Json
  fse.writeFile(buildJsonPath, JSON.stringify(buildJson, null, '\t'), (err) => {
    console.log(err);
  });
}
