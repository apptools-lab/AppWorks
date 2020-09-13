import * as vscode from 'vscode';
import { getUserInfo, checkIsAliInternal } from '@iceworks/common-service';
import { Timer } from './timer';

let timer: Timer;

export async function activate() {
  console.info('start timer');
  let user = { name: vscode.env.machineId };

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
