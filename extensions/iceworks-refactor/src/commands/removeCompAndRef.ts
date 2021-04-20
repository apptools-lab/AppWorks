import { Uri } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import { jsxFileExtnames, getProjectLanguageType, projectPath } from '@iceworks/project-service';
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
  const srcPath = path.join(projectPath, 'src');
  const files: string[] = readdir(srcPath).filter((file: string) => {
    return jsxFileExtnames.find(jsxExt => {
      return file.includes(jsxExt);
    });
  });

  componentFiles.forEach(componentFile => {
    const componentFilePath = path.join(componentPath, componentFile);

    files.forEach(async file => {
      const pageFilePath = path.join(srcPath, file);
      await removeComponent(pageFilePath, componentFilePath, projectLanguageType);
    });
  });
  // remove component
  rimraf.sync(componentPath);
}

export default removeCompAndRef;
