import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { parse } from 'comment-json';
import { getLaunchConfig, getTasksConfig } from './getDefaultConfigs';

// Iceworks debug config
export const BASE_URL = 'http://localhost:3333';
export const CONFIG_NAME = 'Iceworks Debug';
export const CONFIG_START_LABEL = 'Iceworks Start Background Tasks';
export const CONFIG_STOP_LABEL = 'Iceworks Stop Background Tasks';

export interface IDebugConfig {
  version?: string;
  tasks?: any[];
  configurations?: any[];
}

function writeConfigFile(filePath: string, config: IDebugConfig) {
  fs.writeFileSync(
    filePath,
    '// See https://github.com/ice-lab/iceworks/blob/master/extensions/iceworks-app/docs/debug.md \n' +
      '// for the documentation about the Iceworks debug \n' +
      `${JSON.stringify(config, null, '  ')}`
  );
}

// Prepare VS Code debug config
export function setDebugConfig() {
  const { rootPath = __dirname } = vscode.workspace;

  // Make .vscode directory
  const targetDir = path.join(rootPath, '.vscode');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Set pegasus service url
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

  // Set tasks.json
  let tasksConfig;
  const defaultTasksConfig = getTasksConfig();
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
