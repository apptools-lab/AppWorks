import { Uri, window } from 'vscode';
import rimraf from 'rimraf';
import * as path from 'path';
import readdir from 'fs-readdir-recursive';
import * as fse from 'fs-extra';
import { jsxFileExtnames, getProjectLanguageType, projectPath } from '@appworks/project-service';
import { removeComponent } from '../refactor';
import isSupportiveProjectType from '../utils/isSupportiveProjectType';

/**
 * remove the component file and the references
 */
async function removeCompAndRef(uri: Uri) {
  if (!isSupportiveProjectType()) {
    return;
  }
  const projectLanguageType = await getProjectLanguageType();
  const { path: componentPath } = uri;
  const stat = fse.lstatSync(componentPath);
  const srcPath = path.join(projectPath, 'src');
  // remove component from these files in src directory
  const files: string[] = readdir(srcPath).filter((file: string) => {
    return jsxFileExtnames.find(jsxExt => {
      return file.includes(jsxExt);
    });
  });
  if (stat.isDirectory()) {
    // only include .js/.jsx/.tsx file
    // TODO: support remove other files e.g.: .css/.scss/.less
    const componentFiles: string[] = readdir(componentPath, (name) => jsxFileExtnames.includes(path.extname(name)));
    componentFiles.forEach(componentFile => {
      const componentFilePath = path.join(componentPath, componentFile);
      removeComponentFromSrcDir({ componentFilePath, files, srcPath, projectLanguageType });
    });
  } else {
    const extname = path.extname(componentPath);
    if (!jsxFileExtnames.includes(extname)) {
      window.showErrorMessage(`Not support remove ${extname} file. Only support ${jsxFileExtnames.join(', ')} file.`);
      return;
    }
    removeComponentFromSrcDir({ componentFilePath: componentPath, files, srcPath, projectLanguageType });
  }

  // remove component
  rimraf.sync(componentPath);
}

function removeComponentFromSrcDir(
  {
    componentFilePath,
    files,
    srcPath,
    projectLanguageType,
  }: {
    componentFilePath: string,
    files: string[],
    srcPath: string,
    projectLanguageType: string
  },
) {
  files.forEach(async file => {
    const pageFilePath = path.join(srcPath, file);
    await removeComponent(pageFilePath, componentFilePath, projectLanguageType);
  });
}

export default removeCompAndRef;
