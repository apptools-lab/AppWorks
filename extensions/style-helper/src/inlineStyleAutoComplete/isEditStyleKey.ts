import * as vscode from 'vscode';

// The JSX style attribute accepts a JavaScript object.
// If the active word is in an object, it seems like to completing style.
// EXP-1: style={ p|
// EXP-2: style={ \n p|
// EXP-3: position: 'relative', \n p|

export default function isEditStyleKey(word: string, line: vscode.TextLine): boolean {
  let isEditStyle = false;

  const document = vscode.window.activeTextEditor?.document as vscode.TextDocument;
  const currentLineText: string = line.text;

  const previousLine: vscode.TextLine = document.lineAt(line.lineNumber - 1);
  const previousLineText: string = document
    .getText(new vscode.Range(previousLine.range.start, previousLine.range.end))
    .trim();

  if (
    // EXP: marginLeft, margin-left
    /^[a-zA-Z-]+$/.test(word) &&
    // The JSX style attribute accepts a JavaScript object
    (currentLineText.indexOf('{') > -1 || previousLineText.endsWith('{') || previousLineText.endsWith(','))
  ) {
    isEditStyle = true;
  }

  return isEditStyle;
}
