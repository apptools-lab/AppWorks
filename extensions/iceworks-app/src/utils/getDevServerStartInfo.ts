import * as fs from 'fs-extra';
import * as path from 'path';

// rax-app and ice.js will write dev server info in 'node_modules/.tmp/@builder/dev.json'.
// Example:
// {
//   urls: {
//     web: [
//       'http://30.10.80.34:3333/',
//     ],
//     kraken: [
//       'http://30.10.80.34:3333/kraken/index.js',
//       'http://30.10.80.34:3333/kraken/index.js',
//     ],
//   },
//   publicPath: '/',
//   compiledTime: 1607744710376,
// }

export const DEFAULT_START_URL = 'http://localhost:3333/';

const DEV_INFO_FILE = 'node_modules/.tmp/@builder/dev.json';

const TIMEOUT = 60000;
const READER_INTERVAL = 100;
// Temp file valid time(compare to the 'compiledTime'). If over 5 minutes might read the old file.
const MAX_VALID_INTERVAL = 300000;

export function getDevInfo(root: string) {
  let devInfo = null;
  const tempFilePath = path.join(root, DEV_INFO_FILE);
  try {
    devInfo = JSON.parse(fs.readFileSync(tempFilePath, 'utf-8'));
  } catch (e) {
    // ignore
  }
  return devInfo;
}

function checkTempFileValid(devInfo: any) {
  let valid = false;
  if (devInfo && (Date.now() - devInfo.compiledTime) < MAX_VALID_INTERVAL) {
    valid = true;
  }
  return valid;
}

export interface IDevServerStartInfo {
  startUrl: string;
  startQRCodeInfo?: any;
}

export async function getDevServerStartInfo(root: string, timeout?: number): Promise<IDevServerStartInfo | undefined> {
  let timerTimeout;
  let timerReader;

  const timeoutPromise = new Promise((resolve) => {
    timerTimeout = setTimeout(resolve, timeout || TIMEOUT, undefined);
  });

  const readerPromise = new Promise((resolve) => {
    timerReader = setInterval(() => {
      const devInfo = getDevInfo(root);
      if (checkTempFileValid(devInfo)) {
        resolve(devInfo);
      }
    }, READER_INTERVAL);
  });

  const devInfo: any = await Promise.race([timeoutPromise, readerPromise]);

  clearTimeout(timerTimeout);
  clearInterval(timerReader);

  let devServerStartInfo: IDevServerStartInfo | undefined;

  if (devInfo && devInfo.urls) {
    devServerStartInfo = {
      startUrl: devInfo.urls.web && devInfo.urls.web[0] ? devInfo.urls.web[0] : DEFAULT_START_URL,
      startQRCodeInfo: devInfo.urls,
    };
  }

  return devServerStartInfo;
}
