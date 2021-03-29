import * as fse from 'fs-extra';
import { Uri, workspace, WorkspaceEdit, window, Range } from 'vscode';
import prettierFormat from '../utils/prettierFormat';
import generate from './utils/generate';
import parse from './utils/parse';
import {
  findImportSpecifiers,
  removeDeadReferences,
  removeElement,
  findUnreferencedIdentifiers,
} from './parsers';
import executeModules from './utils/executeModules';

export default function removeComponent(
  sourcePath: string,
  resourcePath: string,
  projectLanguageType: string,
) {
  let sourceCode = fse.readFileSync(sourcePath, { encoding: 'utf-8' });

  const options = {
    sourcePath,
    resourcePath,
    projectLanguageType,
  };

  const removeElementsModules = [
    findUnreferencedIdentifiers,
    findImportSpecifiers,
    removeElement,
  ];
  const removeDeadReferencesModules = [removeDeadReferences];

  const executeTasks = [
    removeElementsModules,
    removeDeadReferencesModules,
  ];

  let removeCurrentSourceCode = true;

  for (const task of executeTasks) {
    const ast = parse(sourceCode);
    const ret = { ast };
    const { done } = executeModules(task, 'parse', ret, options);
    if (done) {
      removeCurrentSourceCode = false;
      break;
    }
    sourceCode = generate(ast);
  }

  if (removeCurrentSourceCode) {
    const formattedCode = prettierFormat(sourceCode);
    const uri = Uri.file(sourcePath);
    workspace.openTextDocument(uri).then(document => {
      // get current file content range
      const firstLine = document.lineAt(0);
      const lastLine = document.lineAt(document.lineCount - 1);
      const textRange = new Range(firstLine.range.start, lastLine.range.end);

      const edit = new WorkspaceEdit();
      edit.replace(uri, textRange, formattedCode);

      return workspace.applyEdit(edit).then(success => {
        if (success) {
          window.showTextDocument(document);
        } else {
          fse.writeFileSync(sourcePath, sourceCode);
          console.log(`Fail to write code to ${sourcePath}.`);
        }
      });
    });

    return formattedCode;
  }
}

// (function () {
//   const testPath = path.resolve(__dirname, '../../', 'src/test');
//   const examplesPath = path.resolve(testPath, 'examples');
//   const componentPath = path.join(examplesPath, 'components', 'Detail', 'index.tsx');
//   const pagePath = path.join(examplesPath, 'pages', 'DetailPage', 'index.tsx');
//   const code = removeComponentCode(pagePath, componentPath);
//   console.log('code', code);
// }());
