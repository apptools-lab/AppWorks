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

// witch JSON file is eediting
// now just support build.json & app.json, so just using the file name
let editingJSONFile;
let syncJson;

const initJsonForWeb = async () => {
  const formContent = fse.readFileSync(editingJSONFile === 'build' ? buildJsonPath : appJsonPath, 'utf-8');
  // eslint-disable-next-line
  const schema = require(`../schemas/${(await getProjectFramework()) === 'icejs' ? 'ice' : 'rax'}.${editingJSONFile}.${
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
        i18n.format('extension.iceworksConfigHelper.loadJson.JsonErr', { JsonFileName: editingJSONFile })
      );
    }
  }

  const initmessage = {
    jsonContent: formContentObj,
    schema,
    currentFormCannotEditProps: getFormCannotEditProps(schema),
    currentJsonFileName: `${editingJSONFile}.json`,
  };

  return initmessage;
};

const updateJsonFile = (JsonIncrementalUpdate) => {
  const currentJsonEditer = findBuildJsonEditor(`${editingJSONFile}.json`);
  setSyncJson(JsonIncrementalUpdate, false);

  if (currentJsonEditer) {
    const end = new vscode.Position(currentJsonEditer.document.lineCount + 1, 0);
    currentJsonEditer.edit((editor) => {
      editor.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(syncJson, null, '\t'));
    });
  } else {
    fse.writeFile(
      editingJSONFile === 'build' ? buildJsonPath : appJsonPath,
      JSON.stringify(syncJson, null, '\t'),
      (err) => {
        console.log(err);
      }
    );
  }
  return 'success';
};

const editInJson = (JsonIncrementalUpdate) => {
  let currentJsonEditer = findBuildJsonEditor(`${editingJSONFile}.json`);
  setSyncJson(JsonIncrementalUpdate, true);

  const currentKey = Object.keys(JsonIncrementalUpdate)[0];
  if (!currentJsonEditer) {
    vscode.window.showTextDocument(editingJSONFile === 'build' ? buildJsonUri : appJsonUri, {
      viewColumn: vscode.window.activeTextEditor?.viewColumn === 1 ? 2 : 1,
    });
    currentJsonEditer = findBuildJsonEditor(`${editingJSONFile}.json `);
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

export const services = {
  config: {
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
  } catch {
    // ignore
  }
}

export function clearCache() {
  syncJson = undefined;
}

export function setEditingJSONFile(name: string) {
  editingJSONFile = name;
}
