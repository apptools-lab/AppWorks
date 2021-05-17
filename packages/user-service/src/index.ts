import { ALI_DEF_URL } from '@appworks/constant';
import configure from '@appworks/configure';
import { checkAliInternal } from 'ice-npm-utils';
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
    const token = yield defClient._readToken();
    if (!token) {
      throw new Error('No def token found, please login');
    }
    const res = yield defClient._ensureToken({ token }, defClient._loadUser);
    return res.body.data;
  } else {
    throw new Error('Fail to get user info through def client.');
  }
});

const getUserInfoFromCommand = async function() {
  const { emp_id, nick } = await vscode.commands.executeCommand('core.account.get');
  return { account: nick, empId: emp_id };
}

function promiseWithTimeout<T>(timeoutMs: number, promise: () => Promise<T>, failureMessage?: string) {
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

const timeoutMs = 3 * 60 * 1000;
export async function getUserInfo(): Promise<IUserInfo> {
  const isAliInternal = await checkAliInternal();
  const userData = configure.get(CONFIGURE_USER_KEY) || {};
  const { empId, account, gitlabToken } = userData;
  const gotDataInConfig = empId && account;

  if (gotDataInConfig) {
    return userData;
  } else {
    if (isAliInternal) {
      try {
        const fn = isO2 ? getUserInfoFromCommand : getUserInfoFromDefClient;
        const { account, empid: empId } = await promiseWithTimeout(timeoutMs, fn, 'Timeout!');
        const result = { account, empId, gitlabToken };
        configure.set(CONFIGURE_USER_KEY, result);
        return result;
      } catch (e) {
        throw e;
      }
    } else {
      return userData;
    }
  }
}

export async function saveUserInfo(value: IUserInfo) {
  configure.set(CONFIGURE_USER_KEY, value);
}
