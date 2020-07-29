import * as vscode from 'vscode';
import * as path from 'path';
import { ALI_CREATETASK_URL, ALI_TASKRESULT_URL, ALI_APPLYREPO_URL } from '@iceworks/constant'

const { workspace } = vscode;

export const projectPath = workspace.rootPath || '';
export const LAYOUT_DIRECTORY = 'layouts';
export const PAGE_DIRECTORY = 'pages';
export const COMPONENT_DIR_NAME = 'components';
export const dependencyDir = 'node_modules';
export const packageJSONFilename = 'package.json';
export const jsxFileExtnames = ['.jsx', '.tsx', '.js'];
export const pagesPath = path.join(projectPath, 'src', PAGE_DIRECTORY);
export const componentsPath = path.join(projectPath, 'src', COMPONENT_DIR_NAME);
export const packageJSONPath = path.join(projectPath, packageJSONFilename);

export const generatorCreatetaskUrl = ALI_CREATETASK_URL;
export const generatorTaskResultUrl = ALI_TASKRESULT_URL
export const applyRepositoryUrl = ALI_APPLYREPO_URL;

/**
 * DEF平台返回task的状态值
 */
export enum GeneratorTaskStatus {
  Created = 1,
  running = 2,
  Success = 3,
  Failed = 4,
  Timeout = 5,
}
