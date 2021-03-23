import { Uri } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import { pagesPath, jsxFileExtnames } from '@iceworks/project-service';
import { removeComponentCode } from '../refactor';

function removeComponentAndReference(uri: Uri) {
  const { path: componentPath } = uri;

  const componentFiles: string[] = readdir(componentPath);
  const pageFiles: string[] = readdir(pagesPath).filter(pageFile => {
    return jsxFileExtnames.find(jsxExt => {
      return pageFile.includes(jsxExt);
    });
  });

  componentFiles.forEach(componentFile => {
    const componentFilePath = path.join(componentPath, componentFile);

    pageFiles.forEach(pageFile => {
      const pageFilePath = path.join(pagesPath, pageFile);
      removeComponentCode(pageFilePath, componentFilePath);
    });
  });
  // remove component
  rimraf.sync(componentPath);
}

export default removeComponentAndReference;
