import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import forIn from 'lodash.forin';
import { getProjectFramework } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import i18n from './i18n';

const buildJsonPath = `${vscode.workspace.rootPath}/build.json`;
const appJsonPath = `${vscode.workspace.rootPath}/src/app.json`;
const buildJsonUri = vscode.Uri.file(buildJsonPath);
const appJsonUri = vscode.Uri.file(appJsonPath);

// witch Json file is editing
// now just support build.json & app.json, so just using the file name
let editingJsonFile;

const getInitData = async () => {
  // eslint-disable-next-line
  const schema = require(`../schemas/${(await getProjectFramework()) === 'icejs' ? 'ice' : 'rax'}.${editingJsonFile}.${
    vscode.env.language
  }.json`);

  const initmessage = {
    jsonContent: getEditingJsonFileValue(),
    schema,
    formCannotEditProps: getFormCannotEditProps(schema),
    editingJsonFile: `${editingJsonFile}.json`,
  };

  return initmessage;
};

// 程序锁，标识是否是正在主动更新 Json 文件
// TODO 该标识用于当 webview 通知更新 Json 文件时，则在编辑器文本更新事件中不发送更新 webview Json 的指令，避免死循环
let isUpdatingJsonFile = false;
export function getIsUpdatingJsonFile() {
  return isUpdatingJsonFile;
}

const updateJsonFile = async (incrementalChange) => {
  const currentJsonTextEditor = findVisibleTextEditor(`${editingJsonFile}.json`);
  const json = getEditingJsonByIncrementalChange(incrementalChange, false);

  if (currentJsonTextEditor) {
    const end = new vscode.Position(currentJsonTextEditor.document.lineCount + 1, 0);
    isUpdatingJsonFile = true;
    await currentJsonTextEditor.edit((editor) => {
      editor.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(json, null, '\t'));
    });
    isUpdatingJsonFile = false;
  } else {
    fse.writeFile(
      editingJsonFile === 'build' ? buildJsonPath : appJsonPath,
      JSON.stringify(json, null, '\t'),
      (err) => {
        console.log(err);
      }
    );
  }
};

const editInJsonFile = (incrementalChange) => {
  let currentJsonEditer = findVisibleTextEditor(`${editingJsonFile}.json`);
  const json = getEditingJsonByIncrementalChange(incrementalChange, true);

  const currentKey = Object.keys(incrementalChange)[0];
  if (!currentJsonEditer) {
    vscode.window.showTextDocument(editingJsonFile === 'build' ? buildJsonUri : appJsonUri, {
      viewColumn: vscode.window.activeTextEditor?.viewColumn === 1 ? 2 : 1,
    });
    currentJsonEditer = findVisibleTextEditor(`${editingJsonFile}.json `);
  }

  // 使用 snippet 移动光标；具体的原理是更新整个 json 文件，并且插入光标占位符
  currentJsonEditer!.insertSnippet(
    new vscode.SnippetString(JSON.stringify(json, undefined, '\t').replace(`"${currentKey}": `, `"${currentKey}": $1`)),
    new vscode.Range(new vscode.Position(0, 0), new vscode.Position(currentJsonEditer!.document.lineCount + 1, 0))
  );
};

export const services = {
  config: {
    getInitData,
    updateJsonFile,
    editInJsonFile,
  },
  common,
};

export function setEditingJsonFile(name: string) {
  editingJsonFile = name;
}

function getEditingJsonFileValue() {
  const currentJsonTextEditor = findVisibleTextEditor(`${editingJsonFile}.json`);
  try {
    if (currentJsonTextEditor) {
      return JSON.parse(currentJsonTextEditor.document.getText());
    } else {
      return fse.readJsonSync(editingJsonFile === 'build' ? buildJsonPath : appJsonPath);
    }
  } catch (e) {
    console.error(e);
    vscode.window.showWarningMessage(
      i18n.format('extension.iceworksConfigHelper.loadJson.JsonErr', { JsonFileName: editingJsonFile })
    );
  }
}

function findVisibleTextEditor(fileName: string) {
  return vscode.window.visibleTextEditors.find((editor) => {
    return editor.document.uri.fsPath.endsWith(fileName);
  });
}

function getEditingJsonByIncrementalChange(incrementalChange, useSnippet: boolean) {
  const json = getEditingJsonFileValue();
  forIn(incrementalChange, (value, key) => {
    if (value === null) {
      delete json[key];
    } else if (!useSnippet || (useSnippet && json[key] === undefined)) {
      json[key] = value;
    }
  });
  return json;
}

function getFormCannotEditProps(schema) {
  const webViewCannotEditProps: string[] = [];
  forIn(schema.properties, (value, key) => {
    if (value.type === 'object' || value.type === 'array' || value.oneOf || value.anyOf || value.allOf) {
      webViewCannotEditProps.push(key);
    }
  });
  return webViewCannotEditProps;
}
