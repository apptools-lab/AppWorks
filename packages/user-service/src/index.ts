import { IUserInfo } from './types';
import { ALI_DEF_URL } from '@iceworks/constant';
import configure from '@iceworks/configure';

// eslint-disable-next-line
const co = require('co');

const CONFIGURE_USER_KEY = 'user';

let Client;
let defClient;

try {
  /* eslint-disable */
  Client = require('../def-login-client');
  defClient = new Client({
    server: ALI_DEF_URL,
  });
} catch {
  console.log('def-login-client is not found');
}

export async function getUserInfo(): Promise<IUserInfo> {
  const fn = co.wrap(function* () {
    if (defClient) {
      const user = yield defClient.user();
      return user;
    } else {
      throw new Error('Error: Fail to get user info through def client.');
    }
  });

  // get user info from setting.json
  const userData = configure.get(CONFIGURE_USER_KEY) || {};
  const { empId, account, gitlabToken } = userData;

  if (empId && account) {
    return userData;
  } else {
    try {
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
