import axios from 'axios';
import { checkAliInternal } from 'ice-npm-utils';

// eslint-disable-next-line
const isElectronProcess = require('is-electron');

const isElectron = isElectronProcess();
const logCode = isElectron ? 'pack_app' : 'pack_web';
const outside = '_outside';
let isAlibaba: boolean;


interface ILogParam {
  module: string;
  action: string;
  data?: any;
}

interface IGoldlogParam extends ILogParam {
  namespace: string;
}

const MAIN_KEY = 'main';
const LOGGER_MODULE_KEY = 'logger';

export async function record(originParam: IGoldlogParam) {
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

export function recordOnce(originParam: IGoldlogParam, storage: IStorage) {
  const nowtDate = new Date().toDateString();
  const dauKey = `iceworks.logger.${JSON.stringify(originParam)}`;
  const lastDate = storage.get(dauKey);
  if(nowtDate !== lastDate) {
    storage.update(dauKey, nowtDate);
    return record(originParam);
  }
}

export function recordDAU(storage: IStorage) {
  return recordOnce({
    namespace: MAIN_KEY,
    module: LOGGER_MODULE_KEY,
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
  /**
   * The storage is used to save the record of marking
   * like https://code.visualstudio.com/api/references/vscode-api#Memento
   */
  private storage: IStorage;

  /**
   * Namespace for logger
   */
  private namespace: string = MAIN_KEY;

  constructor(namespace?: string, storage?: IStorage) {
    if (namespace) {
      this.namespace = namespace;
    }

    this.storage = storage;
  }

  /**
   * Make a record
   */
  public record(param: ILogParam) {
    return record({
      namespace: this.namespace,
      ...param
    });
  }

  /**
   * Record once, only once a day
   */
  public recordOnce(param: ILogParam) {
    if (!this.storage) {
      console.error('You need to set the storage before calling this method!');
      return;
    }
    return recordOnce(
      {
        namespace: this.namespace,
        ...param
      },
      this.storage
    );
  }

  /**
   * Record a day's activity
   */
  public recordDAU() {
    if (!this.storage) {
      console.error('You need to set the storage before calling this method!');
      return;
    }
    return recordDAU(this.storage);
  }
}
