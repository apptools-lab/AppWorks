import { ALI_GITLABGROUPS_API, ALI_GITLABPROJECTS_API } from '@appworks/constant';
import axios from 'axios';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as readFiles from 'fs-readdir-recursive';
import { indexFileSuffix } from './constants';

export async function getGitLabGroups(token: string) {
  const res = await axios.get(ALI_GITLABGROUPS_API, {
    params: {
      private_token: token,
    },
  });
  console.log('gitLab groups', res.data);
  return res.data;
}

export async function getExistProjects(token: string) {
  const res = await axios.get(ALI_GITLABPROJECTS_API, {
    params: {
      private_token: token,
    },
  });
  console.log('exist projects', res.data);
  return res.data;
}

export async function checkPathExists(p: string, folderName?: string): Promise<boolean> {
  if (folderName) {
    p = path.join(p, folderName);
  }
  return await fse.pathExists(p);
}

export function findIndexFile(targetPath: string): string {
  const currentSuffix = indexFileSuffix.find((suffix) => fse.pathExistsSync(path.join(targetPath, `index${suffix}`)));
  return currentSuffix ? path.join(targetPath, `index${currentSuffix}`) : undefined;
}

export const getFolderLanguageType = (templateSourceSrcPath) => {
  const files = readFiles(templateSourceSrcPath);

  const index = files.findIndex((item) => {
    return /\.ts(x)/.test(item);
  });

  return index >= 0 ? 'ts' : 'js';
};

export function getFolderExistsTime(folderPath: string) {
  const stat = fse.statSync(folderPath);
  const { birthtime } = stat;
  const curTime = new Date();
  const existsTime = ((curTime.getTime() - birthtime.getTime()) / (60 * 1000));
  return existsTime;
}
