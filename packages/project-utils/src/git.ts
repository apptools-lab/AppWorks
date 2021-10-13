import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';
import * as GitUrlParse from 'git-url-parse';

const gitBranch = require('git-branch');
const gitRemoteOriginUrl = require('git-remote-origin-url');

export interface GitInfo {
  branch: string; // master
  repository: string; // git@github.com:apptools-lab/appworks.git
  remoteUrl: string; // https://github.com/apptools-lab/appworks
  group: string; // apptools-lab
  project: string; // pack
  tag?: string;
  isGit?: boolean;
}

export function checkIsGitProject(dirPath: string) {
  return fse.existsSync(path.join(dirPath, '.git'));
}

export async function getGitBranch(dirPath: string) {
  const branch = await gitBranch(dirPath);
  return branch;
}

export async function getGitRemoteOriginUrl(dirPath: string) {
  const remoteOriginUrl = await gitRemoteOriginUrl(dirPath);
  return remoteOriginUrl;
}

export async function getGitInfo(dirPath: string): Promise<GitInfo> {
  const isGit = checkIsGitProject(dirPath);
  let repository = '';
  let branch = '';
  let tag = '';
  let remoteUrl = '';
  let group = '';
  let project = '';
  if (isGit) {
    try {
      repository = await getGitRemoteOriginUrl(dirPath);
      branch = await getGitBranch(dirPath);
      tag = await execPromise(
        'git describe --all',
        { cwd: dirPath },
      );
      const gitUrlParse = GitUrlParse(repository);
      remoteUrl = gitUrlParse.toString('https');
      group = gitUrlParse.owner;
      project = gitUrlParse.name;
    } catch (e) {
      // ignore error
    }
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
