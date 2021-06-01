
import * as vscode from 'vscode';

function getCompleteItem(itemText: string): vscode.CompletionItem {
  const completionItem = new vscode.CompletionItem(itemText, vscode.CompletionItemKind.Variable);
  completionItem.detail = 'AppWorks';
  completionItem.insertText = `${itemText}: `;
  return completionItem;
}

export default (existKeys: string[] = []): vscode.CompletionItem[] => {
  const existKeysHashMap: {
    [index: string]: number;
  } = {};
  existKeys.forEach((key, index) => {
    existKeysHashMap[key] = index + 1;
  });
  const items = [
    'api',
    'v',
    'data',
    'ecode',
    'appKey',
    'type',
    'dataType',
    'valueType',
    'timeout',
    'headers',
    'ext_headers',
    'ext_querys',
    'isSec',
    'H5Request',
    'WindVaneRequest',
    'LoginRequest',
    'sessionOption',
    'AntiCreep',
    'AntiFlood',
    'needLogin',
    'jsonpIncPrefix',
  ];
  let definitionItems: vscode.CompletionItem[] = [];
  items.forEach((item) => {
    definitionItems.push(getCompleteItem(item));
  });
  definitionItems = definitionItems.filter((item) => {
    return existKeysHashMap[item.label] === undefined;
  });
  return definitionItems;
};
