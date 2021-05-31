import * as vscode from 'vscode';
import * as path from 'path';
import { getDataFromSettingJson, CONFIGURATION_KEY_GENERATE_PAGE_PATH, CONFIGURATION_KEY_GENERATE_COMPONENT_PATH } from '@appworks/common-service';
import { ALI_CREATETASK_URL, ALI_TASKRESULT_URL, ALI_APPLYREPO_URL, ALI_DEF_BASIC_URL } from '@appworks/constant';

const { workspace } = vscode;

export const projectPath = workspace.rootPath || '';
export const LAYOUT_DIRECTORY = 'layouts';
export const PAGE_DIRECTORY = 'pages';
export const COMPONENT_DIR_NAME = 'components';
export const dependencyDir = 'node_modules';
export const packageJSONFilename = 'package.json';
export const jsxFileExtnames = ['.jsx', '.tsx', '.js'];
export const appJSONFileName = 'app.json';

// user set path
const generatePagePath = getDataFromSettingJson(CONFIGURATION_KEY_GENERATE_PAGE_PATH);
const generateComponentPath = getDataFromSettingJson(CONFIGURATION_KEY_GENERATE_COMPONENT_PATH);

export const pagesPath = generatePagePath ? path.join(projectPath, generatePagePath) : path.join(projectPath, 'src', PAGE_DIRECTORY);
export const componentsPath = generateComponentPath ? path.join(projectPath, generateComponentPath) : path.join(projectPath, 'src', COMPONENT_DIR_NAME);
export const layoutsPath = path.join(projectPath, 'src', LAYOUT_DIRECTORY);
export const packageJSONPath = path.join(projectPath, packageJSONFilename);

export const generatorCreatetaskUrl = ALI_CREATETASK_URL;
export const generatorTaskResultUrl = ALI_TASKRESULT_URL;
export const applyRepositoryUrl = ALI_APPLYREPO_URL;
export const basicUrl = ALI_DEF_BASIC_URL;

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
