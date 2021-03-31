import { getProjectFramework } from '@iceworks/project-service';
import { Range, TextEditor, window } from 'vscode';
import { removeComponentSnippet } from '../refactor';

const placeholder = 'ICEWROKS_REFACTOR_PLACEHODER';
/**
 * remove component snippet and the references
 */
async function removeCompSnippetAndRef(textEditor: TextEditor) {
  const projectFramework = await getProjectFramework();
  const supportedProjectFrameWork = ['icejs', 'rax-app'];
  if (!supportedProjectFrameWork.includes(projectFramework)) {
    window.showErrorMessage(`iceworks-refactor: Not support in ${projectFramework} project. Only support ${supportedProjectFrameWork.join(', ')} project.`);
    return;
  }

  const { document, selection } = textEditor;
  const { uri: { path: sourcePath } } = document;

  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const { start, end } = selection;
  const preCode = document.getText(new Range(firstLine.range.start, start));
  const postCode = document.getText(new Range(end, lastLine.range.end));
  const removedSnippetCode = preCode + placeholder + postCode;

  await removeComponentSnippet(removedSnippetCode, sourcePath, placeholder);
}

export default removeCompSnippetAndRef;
