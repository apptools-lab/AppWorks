import axios from 'axios';
import { checkAliInternal } from 'ice-npm-utils';
import storage, { recordKey } from '@iceworks/storage';

// eslint-disable-next-line
const isElectronProcess = require('is-electron');
let vscodeEnv;
try {
  // eslint-disable-next-line
  const vscode = require('is-electron');
  vscodeEnv = vscode.env;
} catch (error) {
  // ignore
}

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

type RecordType = 'PV' | 'UV';

const MAIN_KEY = 'main';

// Compatible with old logic
const RECORD_MODULE_KEY = 'logger';

async function recordPV(originParam: IGoldlogParam, recordType?: RecordType) {
  recordType = recordType || 'PV';
  const param = {
    ...originParam,
    // eslint-disable-next-line
    record_type: recordType,
    recordType,
    cache: Math.random(),
  };

  try {
    const dataKeyArray = Object.keys(param);
    const gokey = dataKeyArray.reduce((finalStr, currentKey, index) => {
      const currentData = typeof param[currentKey] === 'string' ? param[currentKey] : JSON.stringify(param[currentKey]);
      return `${finalStr}${currentKey}=${currentData}${dataKeyArray.length - 1 === index ? '' : '&'}`;
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

    console.log('recorder[type]', recordType);
    console.log('recorder[url]:', url);
    console.log('recorder[param]:', JSON.stringify(param));

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

async function recordUV(originParam: IGoldlogParam) {
  const nowtDate = new Date().toDateString();
  const dauKey = `${JSON.stringify(originParam)}`;
  const records = storage.get(recordKey);
  const lastDate = records[dauKey];
  if (nowtDate !== lastDate) {
    records[dauKey] = nowtDate;
    storage.set(recordKey, records);
    return await recordPV(originParam, 'UV');
  }
}

export async function record(originParam: IGoldlogParam) {
  await recordPV(originParam);
  await recordUV(originParam);
}

export function recordDAU() {
  console.log('recorder[dau]');
  return recordUV({
    namespace: MAIN_KEY,
    module: RECORD_MODULE_KEY,
    action: 'dau',
    data: {
      platform: process.platform,
      locale: vscodeEnv ? vscodeEnv.language : 'zh-CN',
    },
  });
}

export function recordActivate(data: { extension: string; version?: string }) {
  return record({
    namespace: MAIN_KEY,
    module: RECORD_MODULE_KEY,
    action: 'activate',
    data,
  });
}

export class Recorder {
  private namespace: string = MAIN_KEY;

  private version: string;

  constructor(namespace?: string, version?: string) {
    if (namespace) {
      this.namespace = namespace;
    }
    this.version = version;
  }

  public record(param: ILogParam) {
    return record({
      namespace: this.namespace,
      ...param,
    });
  }

  public recordActivate() {
    recordActivate({
      extension: this.namespace,
      version: this.version,
    });

    this.record({
      module: 'main',
      action: 'activate',
      data: {
        version: this.version,
      },
    });
  }
}
