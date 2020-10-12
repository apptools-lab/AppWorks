import * as vscode from 'vscode';
import { getUserInfo, checkIsAliInternal, initExtension } from '@iceworks/common-service';
import { Timer } from './timer';
import createTreeView  from './createTreeView';

// eslint-disable-next-line
const { name } = require('../package.json');

let timer: Timer;

export async function activate(context: vscode.ExtensionContext) {
  // auto set configuration
  initExtension(context, name);

  let user = { empId: vscode.env.machineId, account: 'anonymous' };

  const isAliInternal = await checkIsAliInternal();
  if (isAliInternal) {
    user = await getUserInfo();
  }

  timer = new Timer(user);
  timer.initialize();

  createTreeView(context);
}

export function deactivate() {
  timer.dispose();
}
