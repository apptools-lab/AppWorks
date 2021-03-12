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
  const { emp_id, nick } = await vscode.commands.executeCommand('core.account.get');
  return { account: nick, empId: emp_id };
}

const promiseWithTimeout = <T>(timeoutMs: number, promise: () => Promise<T>, failureMessage?: string) => {
  let timeoutHandle: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error(failureMessage)), timeoutMs);
  });

  return Promise.race([
    promise(),
    timeoutPromise,
  ]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
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
      const { account, empid: empId } = await promiseWithTimeout(60000, fn, 'Timeout!!!');
      const result = { account, empId, gitlabToken };
      configure.set(CONFIGURE_USER_KEY, result);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export async function saveUserInfo(value: IUserInfo) {
  configure.set(CONFIGURE_USER_KEY, value);
}
