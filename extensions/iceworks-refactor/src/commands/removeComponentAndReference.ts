import { Uri, window } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import { pagesPath, jsxFileExtnames, getProjectFramework, getProjectLanguageType } from '@iceworks/project-service';
import { removeComponentCode } from '../refactor';

async function removeComponentAndReference(uri: Uri) {
  const projectFramework = await getProjectFramework();
  const projectLanguageType = await getProjectLanguageType();
  if (!(projectFramework === 'icejs' || projectFramework === 'rax-app')) {
    window.showErrorMessage(`iceworks-refactor: Not support in ${projectFramework} project. Only support in react and rax-app project.`);
    return;
  }
  const { path: componentPath } = uri;

  const componentFiles: string[] = readdir(componentPath);
  const pageFiles: string[] = readdir(pagesPath).filter(pageFile => {
    return jsxFileExtnames.find(jsxExt => {
      return pageFile.includes(jsxExt);
    });
  });

  componentFiles.forEach(componentFile => {
    const componentFilePath = path.join(componentPath, componentFile);

    pageFiles.forEach(async pageFile => {
      const pageFilePath = path.join(pagesPath, pageFile);
      removeComponentCode(pageFilePath, componentFilePath, projectLanguageType);
    });
  });
  // remove component
  rimraf.sync(componentPath);
}

export default removeComponentAndReference;
