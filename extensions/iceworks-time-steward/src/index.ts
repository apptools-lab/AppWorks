import * as vscode from 'vscode';
import { registerCommand, getUserInfo } from '@iceworks/common-service';
import { Timer } from './timer';
import { LogLevel } from './constants';

// eslint-disable-next-line
const { name, version } = require('../package.json');
let timer: Timer;

export function activate(ctx: vscode.ExtensionContext) {
  console.info('start timer');
  const user = { account: '' };
  const init = (user) => {
    timer = new Timer(ctx.extensionPath, user, { name, version });
    timer.initialize();
  };
  getUserInfo()
    .then((userInfo) => {
      console.info('userInfo: ', userInfo);
      init(userInfo);
    })
    .catch((e) => {
      console.error(e.message);
      init(user);
    });
}

export function deactivate() {
  timer.dispose();
  console.info('timer has been disabled!');
}
