import * as vscode from 'vscode';
import * as fse from 'fs-extra';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;


export function loadJson(){
  let buildJSON;
  try{
    buildJSON = fse.readJSONSync(buildJsonPath);
  }catch(e){
    return null;
  }
  return buildJSON;
}

// 检测是否是配置文件
export function isBuildJson(document: vscode.TextDocument){
  return (
    document.uri.fsPath.endsWith('build.json')
  )
}

// 向网页端更新 JSON
export function updateJson(content: string,panel: vscode.WebviewPanel){
  let jsonContent;

  try{
    jsonContent = JSON.parse(content); 
  }catch{
    return;
  }
  console.log(jsonContent);
  panel.webview.postMessage({buildJson:content})
}

// 向文件中更新 Json
export function updateJsonFile(message){
  let buildJsonConfig;
  try{
    buildJsonConfig = (JSON.parse(message.buildJson));
  }catch(e){
    // ignore
  }
  console.log(`message${message}`)
  console.log( `buildJsonConfig${buildJsonConfig}`);
  // fse.outputJSONSync(buildJsonPath,buildJsonConfig)
}