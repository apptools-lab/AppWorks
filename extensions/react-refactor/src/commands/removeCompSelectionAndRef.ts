import { jsxFileExtnames } from '@appworks/project-service';
import { Range, TextEditor, window } from 'vscode';
import * as path from 'path';
import * as fse from 'fs-extra';
import { removeUnreferencedCode } from '../refactor';
import isSupportiveProjectType from '../utils/isSupportiveProjectType';

/**
 * remove component selection and the references
 */
async function removeCompSelectionAndRef(textEditor: TextEditor) {
  const { document, selection } = textEditor;
  const { uri: { path: sourcePath } } = document;

  const ext = path.extname(sourcePath);
  if (!jsxFileExtnames.includes(ext)) {
    window.showErrorMessage(`Only support in ${jsxFileExtnames.join(', ')} file.`);
    return;
  }

  if (!isSupportiveProjectType()) {
    return;
  }
  const originSourceCode = fse.readFileSync(sourcePath, { encoding: 'utf-8' });
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const { start, end } = selection;
  const preCode = document.getText(new Range(firstLine.range.start, start));
  const postCode = document.getText(new Range(end, lastLine.range.end));
  /**
   * avoid occurring syntax errors when user remove the whole JSXElement
   *
   * for example: when user remove the <View> Element
   * before: function () { return <View></View> }.
   * after: function () { return }.
   * the code can't be parsed to ast because it has syntax error
   */
  const placeholder = 'REFACTOR_PLACEHODER';
  const modifiedSourceCode = preCode + placeholder + postCode;

  await removeUnreferencedCode(sourcePath, originSourceCode, modifiedSourceCode, placeholder);
}

export default removeCompSelectionAndRef;
