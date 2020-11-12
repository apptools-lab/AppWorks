import * as fse from 'fs-extra';
import * as path from 'path';
import { wrapExecPromise } from '../utils/common';

const NodeCache = require('node-cache');

const nodeCache = new NodeCache({ stdTTL: 120 });
const cacheTimeoutSeconds = 60 * 30;

export function isGitProject(dirPath: string) {
  return fse.existsSync(path.join(dirPath, '.git'));
}

export interface Resource {
  branch: string;
  repository: string;
  tag?: string;
}

export async function getResource(dirPath: string): Promise<Resource> {
  if (isGitProject(dirPath)) {
    const noSpacesProjDir = dirPath.replace(/^\s+/g, '');
    const cacheId = `resource-info-${noSpacesProjDir}`;

    let resourceInfo = nodeCache.get(cacheId);
    // return from cache if we have it
    if (resourceInfo) {
      return resourceInfo;
    }

    const branch = await wrapExecPromise(
      'git symbolic-ref --short HEAD',
      dirPath,
    );
    const repository = await wrapExecPromise(
      'git config --get remote.origin.url',
      dirPath,
    );
    const tag = await wrapExecPromise(
      'git describe --all',
      dirPath,
    );
    resourceInfo = {
      branch,
      repository,
      tag,
    };

    nodeCache.set(cacheId, resourceInfo, cacheTimeoutSeconds);
    return resourceInfo;
  } else {
    return {
      repository: '',
      branch: '',
      tag: '',
    };
  }
}
