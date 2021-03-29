import { Range, TextEditor } from 'vscode';
import { removeComponentSnippet } from '../refactor';

/**
 * remove component snippet and the reference
 */
async function removeCompSnippetAndRef(textEditor: TextEditor) {
  const { document, selection } = textEditor;
  const { uri: { path: sourcePath } } = document;

  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const { start, end } = selection;
  const removeSnippetCode = document.getText(new Range(firstLine.range.start, start)) + document.getText(new Range(end, lastLine.range.end));

  removeComponentSnippet(removeSnippetCode, sourcePath);
}

export default removeCompSnippetAndRef;
