import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { parse } from 'comment-json';
import { checkIsPegasusProject } from '@appworks/project-service';
import { getLaunchConfig, getTasksConfig } from './getDefaultConfigs';

export const BASE_URL = 'http://localhost:3333';
export const CONFIG_NAME = 'AppWorks Debug';
export const CONFIG_START_LABEL = 'AppWorks Start Background Tasks';
export const CONFIG_STOP_LABEL = 'AppWorks Stop Background Tasks';

export interface IDebugConfig {
  version?: string;
  tasks?: any[];
  configurations?: any[];
}

function writeConfigFile(filePath: string, config: IDebugConfig) {
  fs.writeFileSync(
    filePath,
    '// See https://github.com/apptools-lab/appworks/blob/master/extensions/application-manager/docs/debug.md \n' +
      '// for the documentation about the AppWorks debug \n' +
      `${JSON.stringify(config, null, '  ')}`,
  );
}

// Prepare VS Code debug config
export async function setDebugConfig() {
  const { rootPath = __dirname } = vscode.workspace;

  // Make .vscode directory
  const targetDir = path.join(rootPath, '.vscode');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Set pegasus service url
  const isPegasusProject = await checkIsPegasusProject();
  let specialLaunchUrl = '';
  try {
    const abcConfigFile = path.join(rootPath, 'abc.json');
    if (fs.existsSync(abcConfigFile)) {
      const abcConfig = fs.readJSONSync(abcConfigFile);
      if (abcConfig.type === 'pegasus' && abcConfig.group && abcConfig.name) {
        specialLaunchUrl = `${BASE_URL}/${abcConfig.group}/${abcConfig.name}`;
      }
    }
  } catch (e) {
    // ignore
  }

  // Set launch.json
  let launchConfig;
  const defaultLaunchConfig = getLaunchConfig(specialLaunchUrl);
  const launchConfigPath = path.join(targetDir, 'launch.json');
  if (fs.existsSync(launchConfigPath)) {
    const configurations: any[] = [];
    launchConfig = parse(fs.readFileSync(launchConfigPath).toString());
    (launchConfig.configurations || []).forEach((configuration) => {
      if (configuration.name !== CONFIG_NAME) {
        configurations.push(configuration);
      }
    });
    launchConfig.configurations = configurations.concat(defaultLaunchConfig.configurations);
  } else {
    launchConfig = defaultLaunchConfig;
  }
  writeConfigFile(launchConfigPath, launchConfig);

  let disableOpen = false;
  try {
    const packageConfigFile = path.join(rootPath, 'package.json');
    if (fs.existsSync(packageConfigFile)) {
      const { dependencies = {}, devDependencies = {} } = fs.readJSONSync(packageConfigFile);
      // Only ice.js support set webpack dev server disable open, for now
      // TODO wait rax script support --disable-open or sync getProjectFramework method
      if (devDependencies['ice.js'] || dependencies['ice.js']) {
        disableOpen = true;
      }
    }
  } catch (e) {
    // ignore
  }

  // Set tasks.json
  let tasksConfig;
  const defaultTasksConfig = getTasksConfig(isPegasusProject, disableOpen);
  const tasksConfigPath = path.join(targetDir, 'tasks.json');

  if (fs.existsSync(tasksConfigPath)) {
    const tasks: any[] = [];

    tasksConfig = parse(fs.readFileSync(tasksConfigPath).toString());
    (tasksConfig.tasks || []).forEach((task) => {
      if (task.label !== CONFIG_START_LABEL && task.label !== CONFIG_STOP_LABEL) {
        tasks.push(task);
      }
    });
    tasksConfig.tasks = tasks.concat(defaultTasksConfig.tasks);
  } else {
    tasksConfig = defaultTasksConfig;
  }
  writeConfigFile(tasksConfigPath, tasksConfig);
}
