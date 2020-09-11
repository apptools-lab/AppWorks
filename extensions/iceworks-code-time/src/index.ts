import * as vscode from 'vscode';
import { registerCommand, getUserInfo } from '@iceworks/common-service';
import { WakaTime } from './wakatime';
import { Logger } from './logger';
// import { Options } from './options';
import { LogLevel } from './constants';
// declare module '@ali/def-login-client';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const logger = new Logger(LogLevel.INFO);
let wakatime: WakaTime;

function activate(ctx: vscode.ExtensionContext) {
  logger.info('start vscode time');
  let user = { account: '' };
  const init = (user) => {
    wakatime = new WakaTime(ctx.extensionPath, logger, user, { name, version });

    wakatime.initialize();
  };
  getUserInfo()
    .then((userInfo) => {
      logger.info(`userInfo: `, userInfo);
      init(userInfo);
    })
    .catch((e) => {
      logger.error(e.message);
      init(user);
    });

  registerCommand('getUser', async () => {
    const user = await getUserInfo();
    logger.info(`user: `, user);
  });
}

exports.activate = activate;

export function deactivate() {
  wakatime.dispose();
  logger.info('vscode time has been disabled!');
}
