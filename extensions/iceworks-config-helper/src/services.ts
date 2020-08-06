import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { getProjectFramework } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import i18n from './i18n';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;
const appJsonPath = `${vscode.workspace.rootPath}/src/app.json`;
const buildJsonUri = vscode.Uri.file(buildJsonPath);
const appJsonUri = vscode.Uri.file(appJsonPath);

let jsonFileName;
let syncJson;

const initJsonForWeb = async (panel) => {
  const formContent = fse.readFileSync(jsonFileName === 'build' ? buildJsonPath : appJsonPath, 'utf-8');
  // eslint-disable-next-line
  const schema = require(`../schemas/${(await getProjectFramework()) === 'icejs' ? 'ice' : 'rax'}.${jsonFileName}.${
    vscode.env.language
  }.json`);

  let formContentObj;

  try {
    formContentObj = JSON.parse(formContent);
    syncJson = formContentObj;
  } catch {
    if (formContent.length < 10) {
      syncJson = {};
    } else {
      vscode.window.showWarningMessage(
        i18n.format('extension.iceworksConfigHelper.loadJson.JsonErr', { JsonFileName: jsonFileName })
      );
    }
  }

  const initmessage = {
    jsonContent: formContentObj,
    schema,
    currentFormCannotEditProps: getFormCannotEditProps(schema),
    currentJsonFileName: `${jsonFileName}.json`,
  };

  return initmessage;
};

const updateJsonFile = (JsonIncrementalUpdate) => {
  const currentJsonEditer = findBuildJsonEditor(`${jsonFileName}.json`);
  setSyncJson(JsonIncrementalUpdate, false);

  if (currentJsonEditer) {
    const end = new vscode.Position(currentJsonEditer.document.lineCount + 1, 0);
    currentJsonEditer.edit((editor) => {
      editor.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(syncJson, null, '\t'));
    });
  } else {
    fse.writeFile(
      jsonFileName === 'build' ? buildJsonPath : appJsonPath,
      JSON.stringify(syncJson, null, '\t'),
      (err) => {
        console.log(err);
      }
    );
  }
  return 'success';
};

const editInJson = (JsonIncrementalUpdate) => {
  let currentJsonEditer = findBuildJsonEditor(`${jsonFileName}.json`);
  setSyncJson(JsonIncrementalUpdate, true);

  const currentKey = Object.keys(JsonIncrementalUpdate)[0];
  if (!currentJsonEditer) {
    vscode.window.showTextDocument(jsonFileName === 'build' ? buildJsonUri : appJsonUri, {
      viewColumn: vscode.window.activeTextEditor?.viewColumn === 1 ? 2 : 1,
    });
    currentJsonEditer = findBuildJsonEditor(`${jsonFileName}.json `);
    // webviewPanel.reveal(currentJsonEditer?.viewColumn === 1 ? vscode.ViewColumn.Two : vscode.ViewColumn.One);
  }

  // 使用 snippet 移动光标；具体的原理是更新整个 json 文件，并且插入光标占位符
  currentJsonEditer!.insertSnippet(
    new vscode.SnippetString(
      JSON.stringify(syncJson, undefined, '\t').replace(`"${currentKey}": `, `"${currentKey}": $1`)
    ),
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(currentJsonEditer!.document.lineCount + 1, 0))
  );
};

function findBuildJsonEditor(fileName: string) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.fsPath.endsWith(fileName);
  });
}

export function activePanelEntry() {
  const currentActiveEditor = vscode.window.activeTextEditor;
  if (!currentActiveEditor) return;
  if (currentActiveEditor?.document.uri.fsPath.endsWith('build.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  } else if (currentActiveEditor?.document.uri.fsPath.endsWith('app.json')) {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', true);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
  } else {
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForBuildJson', false);
    vscode.commands.executeCommand('setContext', 'iceworks:showWebViewPanelForAppJson', false);
  }
}

function getIncreamentalUpdate(changedJsonFile) {
  const incrementalChange = {};

  Object.keys(syncJson).forEach((e) => {
    if (changedJsonFile[e] === undefined) {
      incrementalChange[e] = null;
    }
  });

  _.forIn(changedJsonFile, (value, key) => {
    if (!_.isEqual(value, syncJson[key])) {
      incrementalChange[key] = value;
    }
  });

  return Object.keys(incrementalChange).length === 0 ? undefined : incrementalChange;
}

function setSyncJson(messageFromWebview, useSnippet: boolean) {
  _.forIn(messageFromWebview, (value, key) => {
    if (value === null) {
      delete syncJson[key];
    } else if (!useSnippet || (useSnippet && syncJson[key] === undefined)) {
      syncJson[key] = value;
    }
  });
}

function getFormCannotEditProps(schema) {
  const webViewCannotEditProps: string[] = [];
  _.forIn(schema.properties, (value, key) => {
    if (value.type === 'object' || value.type === 'array' || value.oneOf || value.anyOf || value.allOf) {
      webViewCannotEditProps.push(key);
    }
  });
  return webViewCannotEditProps;
}

export async function setSourceJSON() {
  try {
    const projectFramework = await getProjectFramework();

    vscode.extensions.all.forEach((extension) => {
      if (extension.id !== 'iceworks-team.iceworks-config-helper') {
        return;
      }

      const packageJSON = extension.packageJSON;
      if (packageJSON && packageJSON.contributes && (projectFramework === 'rax-app' || projectFramework === 'icejs')) {
        const jsonValidation = packageJSON.contributes.jsonValidation;
        jsonValidation[0].url = `./schemas/${projectFramework === 'icejs' ? 'ice' : 'rax'}.build.${
          vscode.env.language
        }.json`;
        if (projectFramework === 'rax-app') {
          jsonValidation[1].url = `./schemas/rax.app.${vscode.env.language}.json`;
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

export const services = {
  configService: {
    initJsonForWeb,
    updateJsonFile,
    editInJson,
  },
  common,
};

export function updateJsonForWeb(content: string, panel?: vscode.WebviewPanel) {
  try {
    const changedJsonContent = JSON.parse(content);
    const incrementalChange = getIncreamentalUpdate(changedJsonContent);

    if (incrementalChange) {
      syncJson = changedJsonContent;
      panel!.webview.postMessage({
        command: 'iceworks-config-helper: incrementalUpdate',
        userSetting: incrementalChange,
      });
    }
    console.log('incrementalChange', incrementalChange);
  } catch {
    // ignore
  }
}

export function clearCache() {
  syncJson = undefined;
}
export function setJSONFileName(name: string) {
  jsonFileName = name;
}

export function isConfigJson(document: vscode.TextDocument, filenames: string[]) {
  return filenames.find((e) => {
    return document.uri.fsPath.endsWith(e);
  });
}
