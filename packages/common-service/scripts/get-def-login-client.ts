import * as path from 'path';
import * as fse from 'fs-extra';
import * as oss from 'ali-oss';
import * as AdmZip from 'adm-zip';

const ossClient = oss({
  bucket: 'iceworks',
  endpoint: 'oss-cn-hangzhou.aliyuncs.com',
  accessKeyId: 'LTAIycQKC7kFAVHg',
  accessKeySecret: 'ah1oAQV0ED8A7Y3psGwwrtQFUSH073',
  timeout: '300s',
})

const target = 'packages/def-login-client/def-login-client.zip';

/**
 * get def login client package from oss
 */
+ function () {
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
}()