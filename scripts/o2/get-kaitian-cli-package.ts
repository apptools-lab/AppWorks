import * as path from 'path';
import * as fse from 'fs-extra';
import * as oss from 'ali-oss';
import * as AdmZip from 'adm-zip';
import { OSS_PACKAGES } from './constant';

const nodeModulesPath = path.join(__dirname, '..', '..', 'node_modules');

if (process.env.ACCESS_KEY_ID && process.env.ACCESS_KEY_SECRET) {
  const ossClient = oss({
    bucket: 'iceworks-favorite',
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: process.env.ACCESS_KEY_ID,
    accessKeySecret: process.env.ACCESS_KEY_SECRET,
    timeout: '300s',
  });

  (function () {
    OSS_PACKAGES.forEach((packageName) => {
      const ossPackageName = packageName.replace('@ali/', '@ali-');
      const target = `packages/${ossPackageName}.zip`;

      ossClient
        .get(target)
        .then((result) => {
          const zipPath = path.join(__dirname, 'tmp.zip');
          fse.writeFileSync(zipPath, result.content);
          const zip = new AdmZip(zipPath);
          const extractPath = path.join(nodeModulesPath);
          zip.extractAllTo(extractPath, true);
          fse.moveSync(
            path.join(nodeModulesPath, ossPackageName),
            path.join(nodeModulesPath, packageName),
            { overwrite: true },
          );
          fse.removeSync(zipPath);
        })
        .catch((e) => console.error(e));
    });
  })();
} else {
  console.error('Please set ACCESS_KEY_ID && ACCESS_KEY_SECRET');
  process.exit(1);
}
