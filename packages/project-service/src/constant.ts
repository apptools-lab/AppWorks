import * as vscode from 'vscode';
import * as path from 'path';

const { workspace } = vscode;

export const projectPath = workspace.rootPath!;
export const pagesPath = path.join(projectPath, 'src', 'pages');
export const componentsPath = path.join(projectPath, 'src', 'components');
export const componentDirName = 'components';
