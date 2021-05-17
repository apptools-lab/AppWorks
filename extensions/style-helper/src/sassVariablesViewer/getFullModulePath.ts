import * as path from 'path';
import * as vscode from 'vscode';

const SPECIAL_MODULE_IMPORT_REG = /~[^/]+/g;

export default function getFullModulePath(modulePath: string, currentFilePath?: string): string {
  const rootPath = vscode.workspace.rootPath || '';
  let targetPath = modulePath.trim().replace(/'|"/g, '');

  if (!path.extname(targetPath)) {
    targetPath = path.join(targetPath, 'index.scss');
  }

  let fullModulePath = '';
  if (SPECIAL_MODULE_IMPORT_REG.test(targetPath)) {
    // @import '~xxx';
    // https://github.com/sass/sass/issues/2350
    fullModulePath = targetPath.replace(/^~/, path.join(rootPath, 'node_modules', '/'));
  } else if (!path.isAbsolute(targetPath) && currentFilePath) {
    // @import './xxx';
    fullModulePath = path.join(path.dirname(currentFilePath), targetPath);
  } else {
    // @import 'xxx';
    fullModulePath = path.join(rootPath, 'node_modules', targetPath);
  }

  return fullModulePath;
}
