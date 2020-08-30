/* eslint-disable @typescript-eslint/camelcase */
import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { downloadAndGenerateProject } from '@iceworks/generate-project';
import { checkPathExists, getDataFromSettingJson, CONFIGURATION_KEY_NPM_REGISTRY } from '@iceworks/common-service';
import { readPackageJSON } from 'ice-npm-utils';
import * as simpleGit from 'simple-git/promise';
import * as path from 'path';
import axios from 'axios';
import { ALI_EMAIL, ALI_GITLAB_URL } from '@iceworks/constant';
import {
  generatorCreatetaskUrl,
  generatorTaskResultUrl,
  applyRepositoryUrl,
  GeneratorTaskStatus,
  projectPath,
  jsxFileExtnames,
} from './constant';
import i18n from './i18n';
import { IDEFProjectField, IProjectField } from './types';

export * from './constant';

export async function autoSetContext() {
  const isPegasus = await checkIsPegasusProject();
  const languageType = await getProjectLanguageType();
  const type = await getProjectType();
  const framework = await getProjectFramework();
  const isNotTarget = await checkIsNotTarget();
  vscode.commands.executeCommand('setContext', 'iceworks:projectIsNotTarget', isNotTarget);
  vscode.commands.executeCommand('setContext', 'iceworks:projectIsPegasus', isPegasus);
  vscode.commands.executeCommand('setContext', 'iceworks:projectLanguageType', languageType);
  vscode.commands.executeCommand('setContext', 'iceworks:projectType', type);
  vscode.commands.executeCommand('setContext', 'iceworks:projectFramework', framework);
}

export async function checkIsNotTarget() {
  let isNotTarget = false;
  if (!vscode.workspace.rootPath) {
    isNotTarget = true;
  } else {
    try {
      isNotTarget = (await getProjectType()) === 'unknown';
    } catch (e) {
      isNotTarget = true;
    }
  }
  return isNotTarget;
}

export async function getProjectLanguageType() {
  const hasTsconfig = fsExtra.existsSync(path.join(projectPath, 'tsconfig.json'));

  const framework = await getProjectFramework();
  let isTypescript = false;
  if (framework === 'icejs') {
    // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs =
      fsExtra.existsSync(path.join(projectPath, 'src/app.js')) ||
      fsExtra.existsSync(path.join(projectPath, 'src/app.jsx'));
    isTypescript = hasTsconfig && !hasAppJs;
  } else {
    isTypescript = hasTsconfig;
  }

  return isTypescript ? 'ts' : 'js';
}

export async function getProjectType() {
  let type = 'unknown';
  try {
    const { dependencies = {} } = await readPackageJSON(projectPath);
    if (dependencies.rax) {
      type = 'rax';
    }
    if (dependencies.react) {
      type = 'react';
    }
    if (dependencies.vue) {
      type = 'vue';
    }
  } catch (error) {
    // ignore error
  }
 
  return type;
}

export async function checkIsPegasusProject() {
  let isPegasus = false;
  const abcConfigFile = path.join(projectPath, 'abc.json');
  if (fsExtra.existsSync(abcConfigFile)) {
    const abcConfig = await fsExtra.readJSON(abcConfigFile);
    if (abcConfig.type === 'pegasus' && abcConfig.group && abcConfig.name) {
      isPegasus = true;
    }
  }

  return isPegasus;
}

export async function getProjectFramework() {
  let framework = 'unknown';
  try {
    const { dependencies = {}, devDependencies = {} } = await readPackageJSON(projectPath);
    if (dependencies['rax-app']) {
      framework = 'rax-app';
    }
    if (devDependencies['ice.js'] || dependencies['ice.js']) {
      framework = 'icejs';
    }
    if (dependencies.vue) {
      framework = 'vue';
    }
  } catch (error) {
    // ignore error
  }

  return framework;
}

export async function getPackageJSON(packagePath: string): Promise<any> {
  const packagePathIsExist = await fsExtra.pathExists(packagePath);
  if (!packagePathIsExist) {
    throw new Error(i18n.format('package.projectService.index.packageNotFound'));
  }
  return await fsExtra.readJson(packagePath);
}

export function getIceVersion(packageJSON): string {
  const dependencies = packageJSON.dependencies || {};
  const hasIceDesignBase = dependencies['@icedesign/base'];
  return hasIceDesignBase ? '0.x' : '1.x';
}

export function checkIsTemplate(fsPath: string): boolean {
  const fsExtname = path.extname(fsPath);
  return jsxFileExtnames.indexOf(fsExtname) !== -1;
}

export function getScaffoldResources(): object[] {
  const materialSources = vscode.workspace.getConfiguration('iceworks').get('materialSources', []);
  return materialSources;
}

export async function getScaffolds(source: string) {
  const response = await axios.get(source);
  return response.data.scaffolds;
}

export async function getProjectPath(): Promise<string> {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Open',
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  const { fsPath } = selectFolderUri[0];
  return fsPath;
}

export async function createProject(projectField: IProjectField): Promise<string> {
  const { projectPath, projectName, scaffold, ejsOptions } = projectField;
  const projectDir: string = path.join(projectPath, projectName);
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(i18n.format('package.projectService.index.folderExists', { projectDir }));
  }
  const { npm, version } = scaffold.source;
  const registry = getDataFromSettingJson(CONFIGURATION_KEY_NPM_REGISTRY);
  await downloadAndGenerateProject(projectDir, npm, version, registry, projectName, ejsOptions);
  return projectDir;
}

export async function openLocalProjectFolder(projectDir: string, ...args): Promise<void> {
  const webviewPanel = args[1];
  const isProjectDirExists = await checkPathExists(projectDir);
  if (!isProjectDirExists) {
    throw new Error(i18n.format('package.projectService.index.noLocalPath', { projectDir }));
  }
  const newWindow = !!vscode.workspace.rootPath;
  if (newWindow) webviewPanel.dispose();
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), newWindow);
}

export async function createDEFProjectAndCloneRepository(DEFProjectField: IDEFProjectField): Promise<string> {
  const { projectPath, projectName, group, project } = DEFProjectField;
  const projectDir = path.join(projectPath, projectName);
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(i18n.format('package.projectService.index.folderExists', { projectDir }));
  }
  await createDEFProject(DEFProjectField);
  await cloneRepositoryToLocal(projectDir, group, project);
  return projectDir;
}

export async function createDEFProject(DEFProjectField: IDEFProjectField): Promise<void> {
  const { clientToken } = DEFProjectField;
  const response = await generatorCreatetask(DEFProjectField);
  const { data } = response.data;
  const taskId = data.task_id;
  await getGeneratorTaskStatus(taskId, clientToken);
  await applyRepository(DEFProjectField);
}

async function cloneRepositoryToLocal(projectDir, group, project): Promise<void> {
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(i18n.format('package.projectService.index.folderExists', { projectDir }));
  }
  const repoPath = `${ALI_GITLAB_URL}:${group}/${project}.git`;
  await simpleGit().clone(repoPath, projectDir);
}

async function generatorCreatetask(field: IDEFProjectField) {
  const { empId, account, group, project, gitlabToken, scaffold, clientToken, ejsOptions } = field;
  const projectType = field.source.type;
  const { description, source } = scaffold;
  const { npm } = source;
  let generatorId = 6;
  if (projectType === 'rax') {
    generatorId = 5;
  }
  const response = await axios.post(generatorCreatetaskUrl, {
    group,
    project,
    description,
    trunk: 'master',
    generator_id: generatorId,
    schema_data: {
      npmName: npm,
      ...ejsOptions,
    },
    gitlab_info: {
      id: empId,
      token: gitlabToken,
      name: account,
      email: `${account}@${ALI_EMAIL}`,
    },
    emp_id: empId,
    client_token: clientToken,
  });
  console.log('generatorCreatetaskResponse', response);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response;
}

function getGeneratorTaskStatus(taskId: number, clientToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${generatorTaskResultUrl}/${taskId}`, {
          params: {
            need_generator: true,
            client_token: clientToken,
          },
        });
        console.log('generatorTaskResultResponse', response);
        const {
          data: { status },
          error,
        } = response.data;
        if (error) {
          reject(new Error(error));
        }
        if (status !== GeneratorTaskStatus.running && status !== GeneratorTaskStatus.Created) {
          clearInterval(interval);
          if (status === GeneratorTaskStatus.Failed) {
            reject(new Error(i18n.format('package.projectService.index.DEFOutTime', { taskId })));
          }
          if (status === GeneratorTaskStatus.Timeout) {
            reject(new Error(i18n.format('package.projectService.index.DEFOutTime', { taskId })));
          }
          if (status === GeneratorTaskStatus.Success) {
            resolve();
          }
        }
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}

async function applyRepository(field: IDEFProjectField) {
  const { empId, group, project, scaffold, clientToken, source } = field;
  const { description } = scaffold;
  const reason = '';
  const user = [];
  let pubtype = 1; // default publish type: assets
  if (source.type === 'rax') {
    pubtype = 6;
  }
  const response = await axios.post(applyRepositoryUrl, {
    emp_id: empId,
    group,
    project,
    description,
    reason,
    pubtype,
    user,
    client_token: clientToken,
  });
  console.log('applyRepositoryResponse', response);
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response;
}
