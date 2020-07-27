import * as path from 'path';
import * as fse from 'fs-extra';
import * as oss from 'ali-oss';
import * as AdmZip from 'adm-zip';

if (process.env.ACCESS_KEY_ID && process.env.ACCESS_KEY_SECRET) {
  const ossClient = oss({
    bucket: 'iceworks-favorite',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    timeout: '300s',
  })

  const target = 'packages/def-login-client.zip';

  /**
   * get def login client package from oss
   */
  (function () {
    ossClient.get(target)
      .then((result) => {
        const zipPath = path.join(__dirname, '..', 'tmp.zip');
        fse.writeFileSync(zipPath, result.content);
        const zip = new AdmZip(zipPath);
        const extractPath = path.join(__dirname, '..', 'def-login-client');
        zip.extractAllTo(extractPath, true);
        fse.removeSync(zipPath);
      })
      .catch(e => console.error(e))
  })()
}