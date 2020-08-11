import * as vscode from 'vscode';
import * as fse from 'fs-extra';
import forIn from 'lodash.forin';
import * as generateSchema from 'generate-schema';
import { getProjectFramework } from '@iceworks/project-service';
import * as common from '@iceworks/common-service';
import i18n from './i18n';
import { getFileNameFromUri, getBaseNameFromUri } from './utils';

let editingJsonFileUri: vscode.Uri;

const getInitData = async () => {
  let schema;
  try {
    // eslint-disable-next-line
    schema = require(`../schemas/${await getFrameWorkFragement()}.${getFileNameFromUri(editingJsonFileUri)}.${
      vscode.env.language
    }.json`);
  } catch (e) {
    schema = generateSchema.json(getBaseNameFromUri(editingJsonFileUri), getEditingJsonFileValue());
  }

  console.log(`schema for ${getBaseNameFromUri(editingJsonFileUri)}:`, schema);
  const initmessage = {
    jsonContent: getEditingJsonFileValue(),
    schema,
    formCannotEditProps: getFormCannotEditProps(schema),
    editingJsonFile: getBaseNameFromUri(editingJsonFileUri),
  };

  return initmessage;
};

// TODO 程序锁，标识是否正在更新 Json 文件
// 当 webview 通知更新 Json 文件时，则在编辑器文本更新事件中不发送更新 webview Json 的指令，避免死循环
let isUpdatingJsonFile = false;
export function getIsUpdatingJsonFile() {
  return isUpdatingJsonFile;
}

const updateJsonFile = async (incrementalChange) => {
  const currentJsonTextEditor = findVisibleTextEditor(getBaseNameFromUri(editingJsonFileUri));
  const json = getEditingJsonByIncrementalChange(incrementalChange, false);

  if (currentJsonTextEditor) {
    const end = new vscode.Position(currentJsonTextEditor.document.lineCount + 1, 0);
    isUpdatingJsonFile = true;
    await currentJsonTextEditor.edit((editor) => {
      editor.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(json, null, '\t'));
    });
    isUpdatingJsonFile = false;
  } else {
    fse.writeFile(editingJsonFileUri.fsPath, JSON.stringify(json, null, '\t'), (err) => {
      console.log(err);
    });
  }
};

const editInJsonFile = (incrementalChange) => {
  let currentJsonEditer = findVisibleTextEditor(getBaseNameFromUri(editingJsonFileUri));
  const json = getEditingJsonByIncrementalChange(incrementalChange, true);

  const currentKey = Object.keys(incrementalChange)[0];
  if (!currentJsonEditer) {
    vscode.window.showTextDocument(editingJsonFileUri, {
      viewColumn: vscode.window.activeTextEditor?.viewColumn === 1 ? 2 : 1,
    });
    currentJsonEditer = findVisibleTextEditor(getFileNameFromUri(editingJsonFileUri));
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

export function setEditingJsonFileUri(uri: vscode.Uri) {
  editingJsonFileUri = uri;
}

function getEditingJsonFileValue() {
  const currentJsonTextEditor = findVisibleTextEditor(getBaseNameFromUri(editingJsonFileUri));
  try {
    if (currentJsonTextEditor) {
      return JSON.parse(currentJsonTextEditor.document.getText());
    } else {
      return fse.readJsonSync(editingJsonFileUri.fsPath);
    }
  } catch (e) {
    console.error(e);
    vscode.window.showWarningMessage(
      i18n.format('extension.iceworksConfigHelper.loadJson.JsonErr', {
        JsonFileName: getBaseNameFromUri(editingJsonFileUri),
      })
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

async function getFrameWorkFragement() {
  const framwork = await getProjectFramework();
  switch (framwork) {
    case 'icejs':
      return 'ice';
    case 'rax-app':
      return 'rax';
    default:
      return 'NO-Frame';
  }
}
