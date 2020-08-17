import * as path from 'path';
import * as vscode from 'vscode';
import simpleGit, { SimpleGit } from 'simple-git';

const BASE_URL = 'http://gitlab.alibaba-inc.com';

export async function init(...args): Promise<void> {
  const result = args[0];
  if (result.type === 'init' && result.data.id) {
    console.log(result);
    const gitUrl = `${BASE_URL}/${result.data.group}/${result.data.project}.git`;
    let message = `天马模块创建成功，请使用 git clone 模块工程：${gitUrl}`;

    const { commands, window, Uri } = vscode;

    // Chose folder to create
    const folders = await window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: 'Select a folder to clone project',
    });

    if (folders && folders.length === 1) {
      try {
        // Fix VS Code Windows path error, example \D:\xxx to D:\xxx
        const directory = folders[0].path.replace(/^\\/, '');

        const git: SimpleGit = simpleGit({
          baseDir: directory,
          binary: 'git',
        });

        await git.clone(gitUrl);

        commands.executeCommand('vscode.openFolder', Uri.file(path.join(directory, result.data.project)), true);
        message = '天马模块创建成功';
      } catch (e) {
        // ignore
      }
    }

    const webviewPanel = args[2];
    webviewPanel.dispose();
    vscode.window.showInformationMessage(message);
  }
}
