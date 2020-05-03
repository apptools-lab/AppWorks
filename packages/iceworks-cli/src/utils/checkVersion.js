import { getNpmLatestSemverVersion } from 'ice-npm-utils';
import * as semver from 'semver';

export default (packageName: string, packageVersion: string): Promise<version> => {
  // 默认使用 taobao 源，可能会有不同步问题
  return getNpmLatestSemverVersion(packageName, packageVersion).then(latestVersion => {
    if (latestVersion && semver.lt(packageVersion, latestVersion)) {
      return Promise.resolve(latestVersion);
    }
  });
};
