import * as fse from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

function isGitProject(dirPath: string) {
  return fse.existsSync(path.join(dirPath, '.git'));
}

export interface Info {
  branch: string;
  repository: string;
  tag?: string;
  isGit?: boolean;
}

export async function getInfo(dirPath: string): Promise<Info> {
  const isGit = isGitProject(dirPath);
  let branch = '';
  let repository = '';
  let tag = '';
  if (isGit) {
    branch = await execPromise(
      'git symbolic-ref --short HEAD',
      { cwd: dirPath },
    );
    repository = await execPromise(
      'git config --get remote.origin.url',
      { cwd: dirPath },
    );
    tag = await execPromise(
      'git describe --all',
      { cwd: dirPath },
    );
  }
  return {
    branch,
    repository,
    tag,
    isGit,
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
