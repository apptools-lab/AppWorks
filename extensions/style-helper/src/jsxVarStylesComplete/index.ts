import * as fs from 'fs';
import * as vscode from 'vscode';
import * as babelParser from '@babel/parser';
import getCompletionItem from '../getCompletionItem';
import { getFocusCodeInfo } from '../getFocusCodeInfo';
import getFilenameWithoutExtname from './getFilenameWithoutExtname';

function getImportDeclarations(tree) {
  const { body } = tree.program;
  return body.filter((node) => node.type === 'ImportDeclaration');
}

function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
  const editorText = document.getText();
  const { Position, TextEdit } = vscode;
  const { directory, fileName } = getFocusCodeInfo(document, position);

  const completions: vscode.CompletionItem[] = [];

  // className={}
  completions.push(getCompletionItem('className={}', 'Text'));

  // if already use style or has import css file, ignore
  if (
    editorText.indexOf('style') !== -1 ||
    /\.(less|css|scss)$/.test(editorText)
  ) {
    return completions;
  }

  // add styles completion item and auto import
  let newImport = '';
  fs.readdirSync(directory).forEach((file) => {
    if (new RegExp(`${getFilenameWithoutExtname(fileName)}.module.(less|css|scss)$`).test(file)) {
      newImport = `import styles from './${file}';`;
    }
  });

  if (newImport) {
    const ast = babelParser.parse(editorText, {
      // Support JSX and TS
      plugins: ['typescript', 'jsx'],
      sourceType: 'module',
    });

    let positionForNewImport = new Position(0, 0);
    const importASTNodes = getImportDeclarations(ast);
    const lastImportNode = importASTNodes[importASTNodes.length - 1];
    if (lastImportNode) {
      positionForNewImport = new Position(lastImportNode.loc.end.line, 0);
    }

    completions.push(
      getCompletionItem(
        'styles', 'Property', 'styles',
        new vscode.MarkdownString(`**Auto import** \n ${newImport}`), // Docs
        [TextEdit.insert(positionForNewImport, `${newImport}\n`)],
      ),
    );
  }
  return completions;
}

export default function jsxVarStylesComplete(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      [
        { scheme: 'file', language: 'javascriptreact' },
        { scheme: 'file', language: 'typescriptreact' },
      ],
      { provideCompletionItems },
    ),
  );
}
