import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { downloadAndGenerateProject } from '@iceworks/generate-project';
import { checkPathExists, getDataFromSettingJson, CONFIGURATION_KEY_NPM_REGISTRY } from '@iceworks/common-service';
import { checkIsTargetProjectType as orginCheckIsTargetProjectType, checkIsTargetProjectFramework as orginCheckIsTargetProjectFramework, getProjectType as originGetProjectType, getProjectFramework as originGetProjectFramework } from '@iceworks/project-utils';
import * as simpleGit from 'simple-git/promise';
import * as path from 'path';
import { ALI_GITLAB_URL, ALI_DEF_IDP_URL, ALI_DEF_WORK_URL } from '@iceworks/constant';
import { projectPath, jsxFileExtnames } from './constant';
import { generatorCreatetask, getGeneratorTaskStatus, applyRepository, getBasicInfo } from './def';
import { getInfo } from './git';
import i18n from './i18n';
import { getProjectPackageJSON } from './utils';
import { IDEFProjectField, IProjectField } from './types';

export * from './constant';
export * from './dependency';

export async function autoSetContext() {
  const isPegasus = await checkIsPegasusProject();
  const languageType = await getProjectLanguageType();
  const type = await getProjectType();
  const framework = await getProjectFramework();
  const isNotTargetType = !await checkIsTargetProjectType();
  const isNotTargetFramework = !await checkIsTargetProjectFramework();
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

export async function checkIsTargetProjectFramework() {
  return await orginCheckIsTargetProjectFramework(projectPath);
}

export async function getFeedbackLink() {
  const framework = await getProjectFramework();
  if (framework === 'icejs') {
    return 'https://c.tb.cn/F3.ZpKQYk';
  } else if (framework === 'rax-app') {
    return 'https://c.tb.cn/F3.ZLhGNW';
  }
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

export async function getProjectBaseInfo() {
  const { name, description } = await getProjectPackageJSON();
  const type = await getProjectType();
  const framework = await getProjectFramework();
  return {
    name,
    description,
    type,
    framework,
    path: projectPath,
  };
}

export async function getProjectGitInfo() {
  const info = await getInfo(projectPath);
  const repository = info.repository
    .replace(/^git@/, 'https://')
    .replace(/\.git/, '')
    .replace(/\.com:/, '.com/');
  const [,,, group, project] = repository.split('/');
  return { ...info, repository, group, project };
}

export async function getProjectDefInfo(clientToken: string) {
  const { group, project } = await getProjectGitInfo();
  const info = await getBasicInfo(`${group}/${project}`, clientToken);
  return {
    ...info,
    defUrl: `${ALI_DEF_WORK_URL}/app/${info.id}`,
    idpUrl: ALI_DEF_IDP_URL,
  };
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
  const { projectPath: setProjectPath, projectName, scaffold, ejsOptions } = projectField;
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
