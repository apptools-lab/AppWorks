import * as vscode from 'vscode';
import * as fsExtra from 'fs-extra';
import { downloadAndGenerateProject } from '@iceworks/generate-project';
import { IMaterialScaffold } from '@iceworks/material-utils';
import { checkPathExists, getDataFromSettingJson, CONFIGURATION_KEY_NPM_REGISTRY } from '@iceworks/common-service';
import { readPackageJSON } from 'ice-npm-utils';
import * as simpleGit from 'simple-git/promise';
import * as path from 'path';
import axios from 'axios';
import {
  generatorCreatetaskUrl,
  generatorTaskResultUrl,
  applyRepositoryUrl,
  GeneratorTaskStatus,
  projectPath,
  jsxFileExtnames
} from './constant';

export * from './constant';

interface IDEFProjectField {
  empId: string;
  account: string;
  group: string;
  project: string;
  gitlabToken: string;
  scaffold: IMaterialScaffold;
  clientToken: string;
  projectPath: string;
  pubtype: number;
  projectName: string;
}

export async function getProjectLanguageType() {
  const hasTsconfig = fsExtra.existsSync(path.join(projectPath, 'tsconfig.json'));

  const framework = await getProjectFramework();
  let isTypescript = false;
  if (framework === 'icejs') {
    // icejs 都有 tsconfig，因此需要通过 src/app.js[x] 进一步区分
    const hasAppJs = fsExtra.existsSync(path.join(projectPath, 'src/app.js')) || fsExtra.existsSync(path.join(projectPath, 'src/app.jsx'));
    isTypescript = hasTsconfig && !hasAppJs;
  } else {
    isTypescript = hasTsconfig;
  }

  return isTypescript ? 'ts' : 'js';
}

export async function getProjectType() {
  const { dependencies = {} } = await readPackageJSON(projectPath);
  if (dependencies.rax) {
    return 'rax';
  }
  if (dependencies.react) {
    return 'react';
  }
  if (dependencies.vue) {
    return 'vue';
  }
  return 'unknown';
}

export async function getProjectFramework() {
  const { dependencies = {}, devDependencies = {} } = await readPackageJSON(projectPath);
  if (dependencies['rax-app']) {
    return 'rax-app';
  }
  if (devDependencies['ice.js'] || dependencies['ice.js']) {
    return 'icejs';
  }
  if (dependencies.vue) {
    return 'vue';
  }
  return 'unknown';
}

export async function getPackageJSON(packagePath: string): Promise<any> {
  const packagePathIsExist = await fsExtra.pathExists(packagePath);
  if (!packagePathIsExist) {
    throw new Error('Project\'s package.json file not found in local environment');
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

export async function createProject(data): Promise<string> {
  const { projectPath, projectName, scaffold, ejsOptions } = data;
  const projectDir: string = path.join(projectPath, projectName);
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(`文件夹「${projectDir}」已存在，请重新输入应用名称。`)
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
    throw new Error(`本地不存在「${projectDir}」目录！`)
  }
  const newWindow = !!vscode.workspace.rootPath;
  if (newWindow)
    webviewPanel.dispose();
  vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectDir), newWindow);
}

export async function CreateDEFProjectAndCloneRepository(DEFProjectField: IDEFProjectField): Promise<string> {
  const { projectPath, projectName, group, project } = DEFProjectField;
  const projectDir = path.join(projectPath, projectName);
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(`文件夹「${projectDir}」已存在，请重新输入应用名称。`)
  }
  await createDEFProject(DEFProjectField);
  await cloneRepositoryToLocal(projectDir, group, project);
  return projectDir
}

export async function createDEFProject(DEFProjectField: IDEFProjectField): Promise<void> {
  const { clientToken } = DEFProjectField;
  const response = await generatorCreatetask(DEFProjectField);
  const { data } = response.data;
  const taskId = data.task_id;
  await getGeneratorTaskStatus(taskId, clientToken);
  await applyRepository(DEFProjectField)
}

async function cloneRepositoryToLocal(projectDir, group, project): Promise<void> {
  const isProjectDirExists = await checkPathExists(projectDir);
  if (isProjectDirExists) {
    throw new Error(`文件夹「${projectDir}」已存在，请重新输入应用名称。`)
  }
  const repoPath = `git@gitlab.alibaba-inc.com:${group}/${project}.git`;
  await simpleGit().clone(repoPath, projectDir)
}

async function generatorCreatetask(field: IDEFProjectField) {
  const { empId, account, group, project, gitlabToken, scaffold, clientToken } = field;
  const { description, source } = scaffold;
  const { npm } = source;
  const response = await axios.post(generatorCreatetaskUrl, {
    group,
    project,
    description,
    trunk: 'master',
    'generator_id': 6,
    'schema_data': {
      npmName: npm
    },
    'gitlab_info': {
      'id': empId,
      'token': gitlabToken,
      name: account,
      'email': `${account}@alibaba-inc.com`
    },
    'emp_id': empId,
    'client_token': clientToken
  });
  console.log('generatorCreatetaskResponse', response);
  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response;
}

function getGeneratorTaskStatus(taskId: number, clientToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${generatorTaskResultUrl}/${taskId}`, {
          params: {
            'need_generator': true,
            'client_token': clientToken
          }
        })
        console.log('generatorTaskResultResponse', response);
        const { data: { status }, error } = response.data;
        if (error) {
          reject(new Error(error))
        }
        if (status !== GeneratorTaskStatus.running && status !== GeneratorTaskStatus.Created) {
          clearInterval(interval);
          if (status === GeneratorTaskStatus.Failed) {
            reject(new Error(`创建 DEF 应用失败，任务 ID 是： ${taskId}.`))
          }
          if (status === GeneratorTaskStatus.Timeout) {
            reject(new Error(`创建 DEF 应用超时，任务 ID 是：${taskId}.`))
          }
          if (status === GeneratorTaskStatus.Success) {
            resolve()
          }
        }
      } catch (error) {
        reject(error)
      }
    }, 1000);
  });
}

async function applyRepository(field: IDEFProjectField) {
  const { empId, group, project, scaffold, clientToken } = field;
  const { description } = scaffold;
  const reason = '';
  const user = [];
  const pubtype = 1;
  const response = await axios.post(applyRepositoryUrl, {
    'emp_id': empId,
    group,
    project,
    description,
    reason,
    pubtype,
    user,
    'client_token': clientToken
  })
  console.log('applyRepositoryResponse', response);
  if (response.data.error) {
    throw new Error(response.data.error)
  }
  return response;
}