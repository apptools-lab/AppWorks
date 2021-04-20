import { Uri } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import { pagesPath, jsxFileExtnames, getProjectLanguageType } from '@iceworks/project-service';
import { removeComponent } from '../refactor';
import isSupportiveProjectType from '../utils/isSupportiveProjectType';

/**
 * remove the component dir and the references
 */
async function removeCompAndRef(uri: Uri) {
  if (!isSupportiveProjectType()) {
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
