import * as vscode from 'vscode';
import * as path from 'path';
import { decode } from 'js-base64'

const { workspace } = vscode;

export const projectPath = workspace.rootPath || '';
export const pagesPath = path.join(projectPath, 'src', 'pages');
export const componentsPath = path.join(projectPath, 'src', 'components');
export const COMPONENT_DIR_NAME = 'components';
export const dependencyDir = 'node_modules';
export const packageJSONFilename = 'package.json';
export const jsxFileExtnames = ['.jsx', '.tsx', '.js'];
export const packageJSONPath = path.join(projectPath, packageJSONFilename);

export const generatorCreatetaskUrl = decode('aHR0cHM6Ly9hcGkuZGVmLmFsaWJhYmEtaW5jLmNvbS9hcGkvZ2VuZXJhdG9yL2dlbmVyYXRvci9jcmVhdGV0YXNr');
export const generatorTaskResultUrl = decode('aHR0cHM6Ly9hcGkuZGVmLmFsaWJhYmEtaW5jLmNvbS9hcGkvZ2VuZXJhdG9yL2dlbmVyYXRvci90YXNr')
export const applyRepositoryUrl = decode('aHR0cHM6Ly9hcGkuZGVmLmFsaWJhYmEtaW5jLmNvbS9hcGkvd29yay9yZXBvL2FwcGx5')

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
