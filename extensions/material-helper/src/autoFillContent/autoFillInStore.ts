import * as vscode from 'vscode';
import * as path from 'path';
import { getProjectFramework } from '@appworks/project-service';
import * as ejs from 'ejs';
import * as util from 'util';
import * as fs from 'fs';

const renderFileAsync = util.promisify(ejs.renderFile);
const writeFileAsync = util.promisify(fs.writeFile);

enum createFileTypes {
  null,
  store,
  inModels,
}

function checkIsTsorJsFile(filename: string) {
  return ['.js', '.ts'].includes(path.extname(filename));
}

function checkIsValidateStoreFile(srcDir: string, filePath: string, filename: string): boolean {
  const pagesDir = 'src/pages';
  // the file's directory  is or not xxx/src |  xxx/src/pages/xxx/
  const isInValidateDir = !!vscode.workspace.workspaceFolders?.find((workspaceFolder) => {
    return (
      // It prevent user create store.[t|j]s file in models folder,
      !filePath.endsWith('/models') &&
      (
        path.join(workspaceFolder.uri.fsPath, srcDir) === filePath ||
        filePath.startsWith(path.join(workspaceFolder.uri.fsPath, pagesDir))
      )
    );
  });

  const storeFilenames = ['store.ts', 'store.js'];
  return storeFilenames.includes(filename) && isInValidateDir;
}

function checkIsValidateInModelsFolder(srcDir: string, filePath: string, filename: string): boolean {
  const modelsDir = '/models';
  const isInValidateModelsDir = !!vscode.workspace.workspaceFolders?.find((workspaceFolder) => {
    return (
      filePath.includes(path.join(workspaceFolder.uri.fsPath, srcDir)) &&
      filePath.endsWith(modelsDir)
    );
  });
  return isInValidateModelsDir && checkIsTsorJsFile(filename);
}

function getCreateFileType(file: vscode.Uri): createFileTypes {
  const { fsPath } = file;
  const srcDir = 'src';
  const filename = path.basename(fsPath);
  const filePath = path.dirname(fsPath);
  if (checkIsValidateStoreFile(srcDir, filePath, filename)) {
    return createFileTypes.store;
  } else if (checkIsValidateInModelsFolder(srcDir, filePath, filename)) {
    return createFileTypes.inModels;
  } else {
    return createFileTypes.null;
  }
}

async function checkIsValidate(file: vscode.Uri, projectFramework: string): Promise<[createFileTypes, boolean]> {
  if (['rax-app', 'icejs'].includes(projectFramework)) {
    const createFileType = getCreateFileType(file);
    return [createFileType, createFileType !== createFileTypes.null];
  }
  return [createFileTypes.null, false];
}

async function fillContent(
  file: vscode.Uri,
  projectFramework: string,
  createFileType: createFileTypes,
): Promise<string> {
  const { fsPath: newFsPath } = file;
  const dependency = projectFramework === 'icejs' ? 'ice' : 'rax-app';
  const templateName = createFileType === createFileTypes.inModels ? 'models' : 'store';
  const templatePath = path.join(__dirname, `${templateName}.ts.ejs`);
  const content = await renderFileAsync(templatePath, { dependency });
  await writeFileAsync(newFsPath, content);
  return newFsPath;
}

export default async (file: vscode.Uri) => {
  const projectFramework = await getProjectFramework();
  const [createFileType, isValidate] = await checkIsValidate(file, projectFramework);
  if (isValidate) {
    // auto fill content with the type of file;
    const newFsPath = await fillContent(file, projectFramework, createFileType);
    vscode.workspace.openTextDocument(newFsPath);
  }
};
