import * as vscode from 'vscode';
import * as path from 'path';
import * as util from 'util';
import * as fs from 'fs';
import * as ejs from 'ejs';
import * as upperFirst from 'lodash.upperfirst';

const renderFileAsync = util.promisify(ejs.renderFile);
const writeFileAsync = util.promisify(fs.writeFile);

function checkIsDir() {

}

function checkIsTargetType(fsPath: string) {
  return ['.tsx', '.jsx'].includes(path.extname(fsPath));
}

function checkIsInTargetFolder(fsPath: string): boolean {
  return !!vscode.workspace.workspaceFolders?.find(function(workspaceFolder) {
    return fsPath.includes(path.join(workspaceFolder.uri.fsPath, 'src'));
  });
}

export default function() {
  vscode.workspace.onDidCreateFiles(function({ files }) {
    files.map(async function(file) {
      const { fsPath } = file;
      if (checkIsTargetType(fsPath)) {
        const name = upperFirst(path.basename(fsPath));
        const templatePath = path.join(__dirname, 'component.react.tsx.ejs');
        const content = await renderFileAsync(templatePath, { name });
        await writeFileAsync(fsPath, content);
      }
    });
  });
  vscode.workspace.onDidRenameFiles(function({ files }) {
    console.log('onDidRenameFiles', files);
  });
}
