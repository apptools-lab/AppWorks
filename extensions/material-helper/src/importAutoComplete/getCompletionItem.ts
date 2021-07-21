import * as vscode from 'vscode';
import * as path from 'path';
import getFilenameWithoutExtname from './getFilenameWithoutExtname';

export default function getCompletionItem(itemText: string, moduleValue?: string): vscode.CompletionItem {
  // if moduleName is undefined, get it from filename;
  const moduleName = moduleValue || getFilenameWithoutExtname(path.basename(itemText));
  const completionItem = new vscode.CompletionItem(`import ${moduleName} from '${itemText}';`, vscode.CompletionItemKind.Variable);
  // special deal with {  };
  moduleValue = moduleValue === '{  }' ? '{ ${1} }' : `\${1:${moduleName}}`;
  completionItem.detail = 'AppWorks';
  completionItem.insertText = new vscode.SnippetString(`import ${moduleValue} from '${itemText}';`);
  return completionItem;
}
