import * as vscode from 'vscode';
import { getFocusCodeInfo } from '../getFocusCodeInfo';

const SUPPORT_LANGUAGES = ['scss', 'sass'];

// Show current style on hover over
function provideHover(document: vscode.TextDocument, position: vscode.Position) {
  const { line, word, fileName, directory } = getFocusCodeInfo(document, position);


  return new vscode.Hover('Hello');
}

export default function sassVariablesViewer(context: vscode.ExtensionContext): void {
  SUPPORT_LANGUAGES.forEach((language) => {
    // Set provideHover
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(language, { provideHover })
    );
  })
}