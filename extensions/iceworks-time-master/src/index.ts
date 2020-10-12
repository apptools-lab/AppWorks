import * as vscode from 'vscode';
import { getUserInfo, checkIsAliInternal, initExtension } from '@iceworks/common-service';
import { Timer } from './timer';

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
}

export function deactivate() {
  timer.dispose();
  console.info('timer has been disabled!');
}
