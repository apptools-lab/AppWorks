import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { getProjectFramework } from '@iceworks/project-service';
import i18n from './i18n';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;
const appJsonPath = `${vscode.workspace.rootPath}/src/app.json`;
const buildJsonUri = vscode.Uri.file(buildJsonPath);
const appJsonUri = vscode.Uri.file(appJsonPath);

let projectFramework;
let JsonFileName;
let webviewCannotEditProps: string[] = [];
let syncJsonContentObj;
// let lastBuildJsonInExtension;
let webviewLoading = true;

export function clearCache() {
  webviewLoading = true;
  syncJsonContentObj = undefined;
}
export function setJSONFileName(name: string) {
  JsonFileName = name;
}
// 检测是否是配置文件
export function isBuildJson(document: vscode.TextDocument) {
  return document.uri.fsPath.endsWith('build.json');
}

// init json for web
export function initJsonForWeb(panel) {
  const formContent = fse.readFileSync(JsonFileName === 'build' ? buildJsonPath : appJsonPath, 'utf-8');
  console.log(`../schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.${JsonFileName}.${vscode.env.language}.json`);
  // eslint-disable-next-line
  const schema = require(`../schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.${JsonFileName}.${
    vscode.env.language
  }.json`);

  // console.log(schema);
  let formContentObj;

  // 尝试读取 Json 文件
  try {
    formContentObj = JSON.parse(formContent);
    syncJsonContentObj = formContentObj;
  } catch {
    if (formContent.length < 10) {
      syncJsonContentObj = {};
    } else {
      vscode.window.showWarningMessage(
        i18n.format('extension.iceworksConfigHelper.loadJson.JsonErr', { JsonFileName })
      );
    }
  }

  // 进行同步

  const message = {
    JsonContent: formContentObj,
    command: 'initWebview',
    projectFramework,
    JsonFileName,
    loacale: vscode.env.language,
    schema,
  };
  // 发送给 webview
  panel.webview.postMessage(message);
  console.log('initMessage0', message);
}

// 向网页端更新 JSON
export function updateJsonForWeb(content: string, panel?: vscode.WebviewPanel) {
  try {
    const changedJsonContent = JSON.parse(content);
    const message = increamentalUpdateForVebview(changedJsonContent);

    if (message) {
      syncJsonContentObj = changedJsonContent;
      console.log('increamentalUpdateForWebview', message);
      panel!.webview.postMessage({ JsonContent: message });
    }
  } catch {
    // ignore
  }
}

// 向文件中更新 Json
export function updateJsonFile(message, webviewPanel?: vscode.WebviewPanel): void {
  console.log('message', message);
  // console.log('webviewLoading', webviewLoading);
  // 收到网页初始化完成的消息后，发送当前 json 信息给 webview
  if (webviewLoading && message.command === 'iceworks-config-helper:webviewLoadingDone') {
    initJsonForWeb(webviewPanel);
  } else if (message.webviewCannotEditProps) {
    // 应该由网页端判断哪些可以编辑，当收到此条信息时，说明新的 schema 已经被 web view 接受，loading 结束。
    webviewCannotEditProps = message.webviewCannotEditProps;
    webviewLoading = false;
  } else if (!webviewLoading) {
    const { JsonIncrementalUpdate } = message;

    // 如果有打开的 buildJson 编辑器，则直接使用此编辑器而并非写入文件。
    let currentJsonEditer = findBuildJsonEditor(`${JsonFileName}.json`);
    increamentalUpdateFormWebView(JsonIncrementalUpdate, message.command === 'iceworks-config-helper:editInBuild.json');

    // 如果收到了 editinFile 的 command 则采用 snippet 插入的方式控制光标
    if (message.command === 'iceworks-config-helper:editInBuild.json' && webviewPanel) {
      const currentKey = Object.keys(JsonIncrementalUpdate)[0];

      // 调整窗口
      if (!currentJsonEditer) {
        vscode.window.showTextDocument(JsonFileName === 'build' ? buildJsonUri : appJsonUri, {
          viewColumn: webviewPanel.viewColumn === 1 ? 2 : 1,
        });
        currentJsonEditer = findBuildJsonEditor(`${JsonFileName}.json `);
        webviewPanel.reveal(currentJsonEditer?.viewColumn === 1 ? vscode.ViewColumn.Two : vscode.ViewColumn.One);
      }

      // 使用 snippet 移动光标；
      currentJsonEditer!.insertSnippet(
        new vscode.SnippetString(
          JSON.stringify(syncJsonContentObj, undefined, '\t').replace(`"${currentKey}": `, `"${currentKey}": $1`)
        ),
        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(currentJsonEditer!.document.lineCount + 1, 0))
      );
      return;
    }

    if (currentJsonEditer) {
      const end = new vscode.Position(currentJsonEditer.document.lineCount + 1, 0);
      currentJsonEditer.edit((editor) => {
        editor.replace(
          new vscode.Range(new vscode.Position(0, 0), end),
          JSON.stringify(syncJsonContentObj, null, '\t')
        );
      });
    } else {
      fse.writeFile(
        JsonFileName === 'build' ? buildJsonPath : appJsonPath,
        JSON.stringify(syncJsonContentObj, null, '\t'),
        (err) => {
          console.log(err);
        }
      );
    }
  }
}

export function findBuildJsonEditor(fileName: string) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.fsPath.endsWith(fileName);
  });
}

export function activePanelEntry(e: vscode.TextEditor | undefined) {
  if (!e) return;
  if (e?.document.uri.fsPath.endsWith('build.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  } else if (e?.document.uri.fsPath.endsWith('app.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
  } else {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  }
}

function increamentalUpdateForVebview(changedJsonFile) {
  const message = {};

  // 检测是否有删除
  Object.keys(syncJsonContentObj).forEach((e) => {
    if (changedJsonFile[e] === undefined) {
      message[e] = null;
    }
  });

  // 检测是否有变化
  _.forIn(changedJsonFile, (value, key) => {
    if (!_.isEqual(value, syncJsonContentObj[key])) {
      message[key] = value;
    }
  });

  return Object.keys(message).length === 0 ? undefined : message;
}

function increamentalUpdateFormWebView(messageFromWebview, useSnippet: boolean) {
  _.forIn(messageFromWebview, (value, key) => {
    if (value === null) {
      delete syncJsonContentObj[key];
    } else if (!webviewCannotEditProps.includes(key) || (useSnippet && syncJsonContentObj[key] === undefined)) {
      syncJsonContentObj[key] = value;
    }
  });
}

export async function setSourceJSON() {
  try {
    projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (packageJSON && packageJSON.contributes && (projectFramework === 'rax-app' || projectFramework === 'icejs')) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.${
          vscode.env.language === 'zh-cn' ? 'zh-cn' : 'en'
        }.json`;
      }
    });
  } catch (e) {
    // ignore
  }
}
