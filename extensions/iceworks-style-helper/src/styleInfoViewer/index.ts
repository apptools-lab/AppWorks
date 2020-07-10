import * as vscode from 'vscode';
import { findStyle, IStylePosition } from './findStyle';
import { findStyleDependencies } from './findStyleDependencies';
import findStyleSelectors from './findStyleSelectors';
import { getFocusCodeInfo } from '../getFocusCodeInfo';

const SUPPORT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact'
];

// Cmd+Click jump to style definition
function provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
  const { line, word, fileName, directory } = getFocusCodeInfo(document, position);

  if (!/style|className/g.test(line.text)) return;

  const matched = findStyle(directory, word, findStyleDependencies(fileName));
  if (matched) {
    const matchedPosition: IStylePosition = matched.position;
    return new vscode.Location(
      vscode.Uri.file(matched.file),
      // The zero-based line and character value.
      new vscode.Position(matchedPosition.start.line - 1, matchedPosition.start.column - 1)
    );
  }
}

// Show current style on hover over
function provideHover(document: vscode.TextDocument, position: vscode.Position) {
  const { line, word, fileName, directory } = getFocusCodeInfo(document, position);

  if (!/style|className/g.test(line.text)) return;

  const matched = findStyle(directory, word, findStyleDependencies(fileName));
  if (matched) {
    // Markdown css code
    return new vscode.Hover(`\`\`\`css \n ${matched.code} \n \`\`\`\``);
  }
}

// Styles auto Complete
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
  const { line, fileName, directory } = getFocusCodeInfo(document, position);
  if (!/style|className/g.test(line.text)) return;

  // In case of cursor shaking
  const word = line.text.substring(0, position.character);
  const styleDependencies = findStyleDependencies(fileName);

  for (let i = 0, l = styleDependencies.length; i < l; i++) {
    if (
      // className=xxx
      /className=/.test(line.text) ||
      // style={styles.xxx}
      (styleDependencies[i].identifier && new RegExp(`${styleDependencies[i].identifier}\\.$`).test(word))
    ) {
      return findStyleSelectors(directory, styleDependencies).map((selector: string) => {
        // Remove class selector `.`, When use styles.xxx.
        return new vscode.CompletionItem(selector.replace('.', ''), vscode.CompletionItemKind.Variable);
      });
    }
  }
}

export default function styleInfoViewer(context: vscode.ExtensionContext) {
  // Cmd+Click jump to style definition
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      SUPPORT_LANGUAGES,
      { provideDefinition }
    )
  );

  SUPPORT_LANGUAGES.forEach((language) => {
    // Show current style on hover over
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        language,
        { provideHover }
      )
    );

    // Styles auto Complete
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        language,
        { provideCompletionItems },
        // eslint-disable-next-line
        '.', '\"', '\'', ' ',
      )
    );
  });
}

