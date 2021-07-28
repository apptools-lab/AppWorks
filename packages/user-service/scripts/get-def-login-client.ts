import * as path from 'path';
import * as fse from 'fs-extra';
import * as oss from 'ali-oss';
import * as AdmZip from 'adm-zip';
import * as colors from 'colors/safe';

const { ACCESS_KEY_ID, ACCESS_KEY_SECRET, npm_lifecycle_event } = process.env;

async function getDefLoginClient() {
  if (ACCESS_KEY_ID && ACCESS_KEY_SECRET) {
    const ossClient = oss({
      bucket: 'iceworks-favorite',
      endpoint: 'oss-cn-hangzhou.aliyuncs.com',
      accessKeyId: ACCESS_KEY_ID,
      accessKeySecret: ACCESS_KEY_SECRET,
      timeout: '300s',
    });

    const target = 'packages/def-login-client.zip';

    try {
      const result = await ossClient.get(target);
      const zipPath = path.join(__dirname, '..', 'tmp.zip');
      fse.writeFileSync(zipPath, result.content);
      const zip = new AdmZip(zipPath);
      const extractPath = path.join(__dirname, '..', 'def-login-client');
      zip.extractAllTo(extractPath, true);
      fse.removeSync(zipPath);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error(colors.red('=============================================='));
    console.error('\n');
    console.error(colors.red('ERR! Please set ACCESS_KEY_ID && ACCESS_KEY_SECRET'));
    console.error('\n');
    console.error(colors.red('=============================================='));
    if (npm_lifecycle_event === 'prepublishOnly') {
      process.exit(1);
    }
  }
}

getDefLoginClient();