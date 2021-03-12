import { ALI_DEF_URL } from '@iceworks/constant';
import configure from '@iceworks/configure';
import * as vscode from 'vscode';
import { IUserInfo } from './types';

// eslint-disable-next-line
const co = require('co');

const CONFIGURE_USER_KEY = 'user';
const isO2 = !!process.env.O2_VERSION;

let defClient;
try {
  /* eslint-disable */
  const Client = require('../def-login-client');
  defClient = new Client({
    server: ALI_DEF_URL,
  });
} catch {
  console.log('def-login-client is not found');
}

const getUserInfoFromDefClient = co.wrap(function* () {
  if (defClient) {
    const user = yield defClient.user();
    return user;
  } else {
    throw new Error('Error: Fail to get user info through def client.');
  }
});

const getUserInfoFromCommand = async function() {
  return await vscode.commands.executeCommand('core.account.get');
}

export async function getUserInfo(): Promise<IUserInfo> {
  // get user info from setting.json
  const userData = configure.get(CONFIGURE_USER_KEY) || {};
  const { empId, account, gitlabToken } = userData;

  if (empId && account) {
    return userData;
  } else {
    try {
      const fn = isO2 ? getUserInfoFromCommand : getUserInfoFromDefClient;
      const { account, empid: empId } = await fn();
      const result = { account, empId, gitlabToken };
      configure.set(CONFIGURE_USER_KEY, result);
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export async function saveUserInfo(value: IUserInfo) {
  configure.set(CONFIGURE_USER_KEY, value);
}
