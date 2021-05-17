import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { recordCompletionItemProvider } from '@appworks/recorder';
import { getFocusCodeInfo } from '../getFocusCodeInfo';

function unique(arr: string[]) {
  return Array.from(new Set(arr));
}

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  const completions: vscode.CompletionItem[] = [];
  const { word, directory } = getFocusCodeInfo(document, position);

  // Completion items for className writing.
  if (word !== '.') {
    return completions;
  }

  let classNames: string[] = [];
  // Read classNames from the file which is in the same directory.
  fs.readdirSync(directory).forEach((file) => {
    if (path.extname(file) === '.jsx' || path.extname(file) === '.tsx') {
      const filePath = `${directory}/${file}`;
      // Add className="xxx" and  style={styles.xxx}
      classNames = classNames.concat(getClassNames(filePath), getCSSModuleKeys(filePath));
    }
  });
  if (classNames.length) {
    recordCompletionItemProvider();
  }
  return unique(classNames).map((className) => {
    const completionItem = new vscode.CompletionItem(`.${className}`, vscode.CompletionItemKind.Text);
    completionItem.detail = 'AppWorks';
    completionItem.insertText = `.${className} {\n  \n}`;
    completionItem.command = { command: 'style-helper.recordCompletionItemSelect', title: '' };
    return completionItem;
  });
}

// Process className="xxx"
function getClassNames(filePath: string): string[] {
  const code = fs.readFileSync(filePath, 'utf8');
  const reg = new RegExp('className="([\\w- ]+)"', 'g');

  let classNames: string[] = [];
  let matched: RegExpExecArray | null;

  // eslint-disable-next-line
  while ((matched = reg.exec(code)) !== null) {
    const className = matched[1];
    // Process className="test1 test2"
    if (className.includes(' ')) {
      classNames = classNames.concat(className.split(' '));
    } else {
      classNames.push(className);
    }
  }
  return classNames;
}

// Process style={styles.xxx}
function getCSSModuleKeys(filePath: string): string[] {
  const code = fs.readFileSync(filePath, 'utf8');
  const reg = new RegExp('style=\\{styles\\.([\\w\\.]+)\\}', 'g');

  const CSSModuleKeys: string[] = [];
  let matched: RegExpExecArray | null;

  // eslint-disable-next-line
  while ((matched = reg.exec(code)) !== null) {
    CSSModuleKeys.push(matched[1]);
  }
  return CSSModuleKeys;
}

// Set completion
export default function cssClassAutoCompete(context: vscode.ExtensionContext): void {
  // Register completionItem provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: 'file', language: 'css' },
        { scheme: 'file', language: 'less' },
        { scheme: 'file', language: 'sass' },
        { scheme: 'file', language: 'scss' },
      ],
      { provideCompletionItems },
      '.',
    ),
  );
}
