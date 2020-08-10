import * as vscode from 'vscode';
import { recordDAU } from '@iceworks/recorder';
import getCurrentJsxElement from './getCurrentJsxElement';
import getHoverItem from './getHoverItem';

async function provideHover(document, position): Promise<vscode.Hover | undefined> {
  // const { Position } = vscode;
  const documentText = document.getText();
  const cursorPosition = document.offsetAt(position);
  const currentJsxElement: any = getCurrentJsxElement(documentText, cursorPosition);
  const currentJsxElementTagName = currentJsxElement ? currentJsxElement.name.name : '';

  if (
    currentJsxElement &&
    currentJsxElement.loc &&
    // Only works in React/Rax Component (begin with capital letters).
    currentJsxElementTagName[0] === currentJsxElementTagName[0].toUpperCase()
  ) {
    const tag = currentJsxElement;
  }
  if (currentJsxElement && getHoverItem(currentJsxElementTagName) !== undefined) {
    return getHoverItem(currentJsxElementTagName);
  }
}

// Set completion
export default function hoverDocs() {
  vscode.languages.registerHoverProvider(['javascript', 'javascriptreact', 'typescript', 'typescriptreact'], {
    provideHover,
  });
}
