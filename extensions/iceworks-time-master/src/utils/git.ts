import * as fse from 'fs-extra';
import * as path from 'path';
import { wrapExecPromise } from '../utils/common';
const NodeCache = require('node-cache');

const nodeCache = new NodeCache({ stdTTL: 120 });
const cacheTimeoutSeconds = 60 * 30;

export function isGitProject(projectDir: string) {
  return fse.existsSync(path.join(projectDir, '.git'));
}

export interface Resource {
  branch: string;
  repository: string;
  tag: string;
}

export async function getResource(projectDir: string): Promise<Resource> {
  if (isGitProject(projectDir)) {
    const noSpacesProjDir = projectDir.replace(/^\s+/g, '');
    const cacheId = `resource-info-${noSpacesProjDir}`;

    let resourceInfo = nodeCache.get(cacheId);
    // return from cache if we have it
    if (resourceInfo) {
      return resourceInfo;
    }

    const branch = await wrapExecPromise(
      'git symbolic-ref --short HEAD',
      projectDir,
    );
    const repository = await wrapExecPromise(
      'git config --get remote.origin.url',
      projectDir,
    );
    const tag = await wrapExecPromise(
      'git describe --all',
      projectDir,
    );
    resourceInfo = {
      branch,
      repository,
      tag,
    };

    nodeCache.set(cacheId, resourceInfo, cacheTimeoutSeconds);
    return resourceInfo;
  }
}