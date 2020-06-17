import axios from 'axios';
import { checkAliInternal } from 'ice-npm-utils';

// eslint-disable-next-line
const isElectronProcess = require('is-electron');

const isElectron = isElectronProcess();
const logCode = isElectron ? 'pack_app' : 'pack_web';
const outside = '_outside';
let isAlibaba: boolean;


interface ILogParam {
  namespace?: string;
  module: string;
  action: string;
  data?: any;
}

interface IGoldlogParam extends ILogParam {
  namespace: string;
}

export async function log(originParam: IGoldlogParam) {
  const param = {
    ...originParam,
    cache: Math.random(),
  };
  try {
    const dataKeyArray = Object.keys(param);
    const gokey = dataKeyArray.reduce((finalStr, currentKey, index) => {
      const currentData =
          typeof param[currentKey] === 'string'
            ? param[currentKey]
            : JSON.stringify(param[currentKey]);
      return `${finalStr}${currentKey}=${currentData}${
        dataKeyArray.length - 1 === index ? '' : '&'
      }`;
    }, '');

    if (typeof isAlibaba === 'undefined') {
      try {
        isAlibaba = await checkAliInternal();
      } catch (error) {
        // ignore error
      }
    }

    const url = `http://gm.mmstat.com/iceteam.iceworks.${logCode}${!isAlibaba ? outside : ''}`;
    const data = {
      gmkey: 'CLK',
      gokey: encodeURIComponent(gokey),
      logtype: '2',
    };
    console.log('log-url:', url);
    console.log('log-data:', data);

    await axios({
      method: 'post',
      url,
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        origin: 'https://www.taobao.com',
        referer: 'https://www.taobao.com/',
      },
      data,
    });
  } catch (error) {
    error.name = 'goldlog-error';
    console.error(error);
  }
}

export async function dau(storage: IStorage, data?: { version: string }) {
  const nowtDate = new Date().toDateString();
  const dauKey = 'dauRecordTime';
  const lastDate = storage.get(dauKey);
  if(nowtDate !== lastDate) {
    storage.set(dauKey, nowtDate);
    log({
      namespace: 'main',
      module: 'log',
      action: 'dau',
      data: {
        platform: process.platform,
        ...data,
      },
    });
  }
}

interface IStorage {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
}

export class Logger {
  private storage: IStorage;
  private namespace: string;
  private version: string;

  constructor(storage: IStorage, config: { namespace: string; version: string; }) {
    this.storage = storage;
    this.namespace = config.namespace;
    this.version = config.version;
  }

  public log(param: ILogParam) {
    log({
      namespace: this.namespace,
      ...param
    })
  }

  public dau() {
    return dau(this.storage, { version: this.version });
  }
}
