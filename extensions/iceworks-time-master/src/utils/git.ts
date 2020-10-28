import * as fse from 'fs-extra';
import * as path from 'path';
import { wrapExecPromise } from '../utils/common';

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
    return {
      branch,
      repository,
      tag,
    };
  }
}