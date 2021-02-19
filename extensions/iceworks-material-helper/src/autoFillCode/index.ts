import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as upperFirst from 'lodash.upperfirst';

const renderFileAsync = util.promisify(ejs.renderFile);
const writeFileAsync = util.promisify(fs.writeFile);

function checkIsCreatedDir() {

}

function checkIsTargetType(fsPath: string) {
  return ['.tsx', '.jsx'].includes(path.extname(fsPath));
}

function checkIsInTargetFolder(fsPath: string): boolean {
  return !!vscode.workspace.workspaceFolders?.find(function(workspaceFolder) {
    return fsPath.includes(path.join(workspaceFolder.uri.fsPath, 'src'));
  });
}

function checkIsIndexNames(name: string): boolean {
  return ['index'].includes(name);
}

export default function() {
  vscode.workspace.onDidCreateFiles(async function({ files }) {
    console.log('onDidCreateFiles', files);
    await Promise.all(files.map(async function(file) {
      const { fsPath } = file;
      const isTargetType = checkIsTargetType(fsPath);
      if (isTargetType) {
        const filename = path.basename(fsPath, path.extname(fsPath));
        const dirname = path.basename(path.dirname(fsPath));
        const name = upperFirst(checkIsIndexNames(filename) ? dirname : filename);
        const templatePath = path.join(__dirname, 'component.react.tsx.ejs');
        const content = await renderFileAsync(templatePath, { name });
        await writeFileAsync(fsPath, content);
      }
    }));
  });
  vscode.workspace.onDidRenameFiles(function({ files }) {
    console.log('onDidRenameFiles', files);
  });
}
