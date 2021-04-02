import { getProjectFramework, jsxFileExtnames } from '@iceworks/project-service';
import { Range, TextEditor, window } from 'vscode';
import * as path from 'path';
import { removeComponentSelection } from '../refactor';

/**
 * remove component selection and the references
 */
async function removeCompSelectionAndRef(textEditor: TextEditor) {
  const projectFramework = await getProjectFramework();
  const supportedProjectFrameWork = ['icejs', 'rax-app'];
  if (!supportedProjectFrameWork.includes(projectFramework)) {
    window.showErrorMessage(`iceworks-refactor: only support ${supportedProjectFrameWork.join(', ')} project.`);
    return;
  }

  const { document, selection } = textEditor;
  const { uri: { path: sourcePath } } = document;

  const ext = path.extname(sourcePath);
  if (!jsxFileExtnames.includes(ext)) {
    window.showErrorMessage(`iceworks-refactor: only support in ${jsxFileExtnames.join(', ')} file.`);
    return;
  }

  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const { start, end } = selection;
  const preCode = document.getText(new Range(firstLine.range.start, start));
  const postCode = document.getText(new Range(end, lastLine.range.end));
  /**
   * avoid occurring syntax errors when user remove the whole JSXElement
   *
   * for example: when user remove the <View> Element,  the code can't be parsed to ast.
   * function () { return <View /> }.
   */
  const placeholder = 'ICEWROKS_REFACTOR_PLACEHODER';
  const removedSelectionCode = preCode + placeholder + postCode;

  await removeComponentSelection(removedSelectionCode, sourcePath, placeholder);
}

export default removeCompSelectionAndRef;
