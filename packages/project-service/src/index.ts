import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { downloadAndGenerateProject } from '@iceworks/generate-project';
import { checkPathExists, getDataFromSettingJson, CONFIGURATION_KEY_NPM_REGISTRY } from '@iceworks/common-service';
import { checkIsTargetProjectType as orginCheckIsTargetProjectType, checkIsTargetProjectFramework, getProjectType as originGetProjectType, getProjectFramework as originGetProjectFramework } from '@iceworks/project-utils';
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
  const isNotTargetType = !await checkIsTargetProjectType();
  const isNotTargetFramework = !await checkIsTargetProjectFramework(projectPath);
  vscode.commands.executeCommand('setContext', 'iceworks:projectIsNotTargetType', isNotTargetType);
  vscode.commands.executeCommand('setContext', 'iceworks:projectIsNotTargetFramework', isNotTargetFramework);
  vscode.commands.executeCommand('setContext', 'iceworks:projectIsPegasus', isPegasus);
  vscode.commands.executeCommand('setContext', 'iceworks:projectLanguageType', languageType);
  vscode.commands.executeCommand('setContext', 'iceworks:projectType', type);
  vscode.commands.executeCommand('setContext', 'iceworks:projectFramework', framework);
}

export async function checkIsTargetProjectType() {
  return await orginCheckIsTargetProjectType(projectPath);
}

export async function getProjectLanguageType() {
  const hasTsconfig = fsExtra.existsSync(path.join(projectPath, 'tsconfig.json'));

  const framework = await getProjectFramework();
  let isTypescript = false;

  if (framework !== 'unknown') {
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
  return await originGetProjectType(projectPath);
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
  return await originGetProjectFramework(projectPath);
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

export async function getFolderPath(openLabel = 'Open'): Promise<string | undefined> {
  const options: vscode.OpenDialogOptions = {
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel,
  };
  const selectFolderUri = await vscode.window.showOpenDialog(options);
  if (selectFolderUri) {
    const { fsPath } = selectFolderUri[0];
    return fsPath;
  }
}

export async function createProject(projectField: IProjectField): Promise<string> {
  const { projectPath: setProjectPath, projectName, scaffold } = projectField;
  let ejsOptions = {};
  if (projectField.ejsOptions) {
    ejsOptions = modifyEjsOptions(projectField.ejsOptions);
  }
  const projectDir: string = path.join(setProjectPath, projectName);
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
  const { projectPath: setProjectPath, projectName, group, project } = DEFProjectField;
  const projectDir = path.join(setProjectPath, projectName);
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
  const { empId, account, group, project, gitlabToken, scaffold, clientToken } = field;
  let ejsOptions = {};
  if (field.ejsOptions) {
    ejsOptions = modifyEjsOptions(field.ejsOptions);
  }
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
  const { empId, group, project, scaffold, clientToken, source, pubAppType } = field;
  const { description } = scaffold;
  const reason = '';
  const user = [];
  // default publish type: assets = 1
  let pubtype = 1;
  if (source.type === 'rax') {
    // weex = 3
    // webapp = 6
    pubtype = pubAppType === 'web' ? 6 : 3;
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

function modifyEjsOptions(ejsOptions) {
  let enableMPA = false;
  let enablePHA = false;
  let targets = [];

  const { appType } = ejsOptions;

  if (appType === 'web-mpa') {
    enableMPA = true;
    enablePHA = true;
    targets = ['web'];
  } else if (appType === 'miniapp') {
    targets = ['web', 'miniapp', 'wechat-miniprogram'];
  } else if (appType === 'kraken-mpa') {
    enableMPA = true;
    targets = ['web', 'kraken'];
  } else if (appType === 'weex-mpa') {
    enableMPA = true;
    targets = ['web', 'weex'];
  }

  return {
    ...ejsOptions,
    mpa: enableMPA,
    pha: enablePHA,
    targets,
  };
}
