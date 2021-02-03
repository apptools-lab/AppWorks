import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import * as GitUrlParse from 'git-url-parse';

const gitBranch = require('git-branch');
const gitRemoteOriginUrl = require('git-remote-origin-url');

export interface Info {
  branch: string; // master
  repository: string; // git@github.com:ice-lab/iceworks.git
  remoteUrl: string; // https://github.com/ice-lab/iceworks
  group: string; // ice-lab
  project: string; // iceworks
  tag?: string;
  isGit?: boolean;
}

export function checkIsGitProject(dirPath: string) {
  return fse.existsSync(path.join(dirPath, '.git'));
}

export async function getBranch(dirPath: string) {
  const branch = await gitBranch(dirPath);
  return branch;
}

export async function getRemoteOriginUrl(dirPath: string) {
  const remoteOriginUrl = await gitRemoteOriginUrl(dirPath);
  return remoteOriginUrl;
}

export async function getInfo(dirPath: string): Promise<Info> {
  const isGit = checkIsGitProject(dirPath);
  let repository = '';
  let branch = '';
  let tag = '';
  let remoteUrl = '';
  let group = '';
  let project = '';
  if (isGit) {
    repository = await getRemoteOriginUrl(dirPath);
    branch = await getBranch(dirPath);
    tag = await execPromise(
      'git describe --all',
      { cwd: dirPath },
    );
    const gitUrlParse = GitUrlParse(repository);
    remoteUrl = gitUrlParse.toString('https');
    group = gitUrlParse.owner;
    project = gitUrlParse.name;
  }
  return {
    branch,
    repository,
    remoteUrl,
    tag,
    isGit,
    group,
    project,
  };
}

function execPromise(command: string, opts: any): Promise<string> {
  return new Promise(((resolve, reject) => {
    exec(command, opts, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        // @ts-ignore
        resolve(stdout.trim());
      }
    });
  }));
}
