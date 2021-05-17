import * as vscode from 'vscode';
import { recordDAU, record } from '@appworks/recorder';
import { getDataFromSettingJson } from './vscode';

const { name: namespace } = require('../package.json');

export function registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any) {
  return vscode.commands.registerCommand(
    command,
    (...args) => {
      recordDAU();
      recordExecuteCommand(command, args);
      callback(...args);
    },
    thisArg,
  );
}

export function executeCommand(...arg: any[]) {
  // TODO Parameter type judgment
  const reset = arg.length > 2 ? arg.slice(0, arg.length - 2) : arg;
  return vscode.commands.executeCommand.apply(null, reset);
}

export function createNpmCommand(action: string, target = '', extra = ''): string {
  const packageManager = getDataFromSettingJson('packageManager', 'npm');
  let registry = '';
  if (!(packageManager === 'cnpm' || packageManager === 'tnpm' || action === 'run')) {
    registry = ` --registry ${getDataFromSettingJson('npmRegistry', 'https://registry.npm.taobao.org')}`;
  }
  target = target && ` ${target}`;
  extra = extra && ` ${extra}`;
  return `${packageManager} ${action}${target}${registry}${extra}`;
}

function recordExecuteCommand(command: string, args: any[]) {
  return record({
    namespace,
    module: 'executeCommand',
    action: command,
    data: args,
  });
}
