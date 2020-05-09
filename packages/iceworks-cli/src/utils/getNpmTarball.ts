import axios from 'axios';
import * as urlJoin from 'url-join';
import * as path from 'path';
import * as semver from 'semver';
import log from './log';

/**
 * 获取指定 npm 包版本的 tarball
 */
export default async function getNpmTarball(npm: string, version: string, registry: string): Promise<string> {
  const url = urlJoin(registry, npm);

  log.verbose('getNpmTarball', url);
  const { data: body } = await axios.get(url);

  if (!semver.valid(version)) {
    version = body['dist-tags'].latest;
  }

  if (
    semver.valid(version) &&
    body.versions &&
    body.versions[version] &&
    body.versions[version].dist
  ) {
    const tarball = body.versions[version].dist.tarball;
    log.verbose('getNpmTarball', tarball);
    return tarball;
  }

  throw new Error(`${name}@${version} 尚未发布`);
};
