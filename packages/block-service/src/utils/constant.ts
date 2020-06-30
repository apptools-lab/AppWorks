import * as vscode from 'vscode';
import * as path from 'path';

const { workspace } = vscode;

export const projectPath = workspace.rootPath!;
export const pagesPath = path.join(projectPath, 'src', 'pages');
export const componentDirName = 'components';
export const dependencyDir = 'node_modules';
export const packageJSONFilename = 'package.json';
