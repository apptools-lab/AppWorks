import { Uri, window } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import { pagesPath, jsxFileExtnames, getProjectFramework, getProjectLanguageType } from '@iceworks/project-service';
import { removeComponent } from '../refactor';

/**
 * remove the component dir and the references
 */
async function removeCompAndRef(uri: Uri) {
  const projectFramework = await getProjectFramework();
  const supportedProjectFrameWork = ['icejs', 'rax-app'];
  if (!supportedProjectFrameWork.includes(projectFramework)) {
    window.showErrorMessage(`iceworks-refactor: Not support in ${projectFramework} project. Only support ${supportedProjectFrameWork.join(', ')} project.`);
    return;
  }
  const projectLanguageType = await getProjectLanguageType();
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
      await removeComponent(pageFilePath, componentFilePath, projectLanguageType);
    });
  });
  // remove component
  rimraf.sync(componentPath);
}

export default removeCompAndRef;
