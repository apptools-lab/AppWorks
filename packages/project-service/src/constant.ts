import * as vscode from 'vscode';
import * as path from 'path';

const { workspace } = vscode;

export const projectPath = workspace.rootPath || '';
export const pagesPath = path.join(projectPath, 'src', 'pages');
export const componentsPath = path.join(projectPath, 'src', 'components');
export const COMPONENT_DIR_NAME = 'components';

export const generatorCreatetaskUrl = 'https://api.def.alibaba-inc.com/api/generator/generator/createtask';
export const generatorTaskResultUrl = 'https://api.def.alibaba-inc.com/api/generator/generator/task';

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
