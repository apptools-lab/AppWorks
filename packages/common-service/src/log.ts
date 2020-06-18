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

export function once(originParam: IGoldlogParam, storage: IStorage) {
  const nowtDate = new Date().toDateString();
  const dauKey = `iceworks.logger.${JSON.stringify(originParam)}`;
  const lastDate = storage.get(dauKey);
  if(nowtDate !== lastDate) {
    storage.update(dauKey, nowtDate);
    return log(originParam);
  }
}

export function dau(storage: IStorage) {
  return once({
    namespace: 'main',
    module: 'logger',
    action: 'dau',
    data: {
      platform: process.platform,
    },
  }, storage);
}

interface IStorage {
  get: (key: string) => any;
  update: (key: string, value: any) => void;
}

export class Logger {
  private storage: IStorage;

  private namespace: string;

  constructor(storage: IStorage, namespace: string) {
    this.storage = storage;
    this.namespace = namespace;
  }

  public log(param: ILogParam) {
    return log({
      namespace: this.namespace,
      ...param
    });
  }

  public once(param: ILogParam) {
    return once(
      {
        namespace: this.namespace,
        ...param
      },
      this.storage
    );
  }

  public dau() {
    return dau(this.storage);
  }
}
