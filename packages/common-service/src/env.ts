import { checkAliInternal } from 'ice-npm-utils';
import * as vscode from 'vscode';

// eslint-disable-next-line
const NodeCache = require('node-cache');
const nodeCache = new NodeCache();

const cacheId = 'isAliInternal';
const cacheTimeoutSeconds = 60 * 60;

export function checkIsO2() {
  const O2Version = process.env.O2_VERSION;
  return O2Version;
}

export async function checkIsAliInternal(): Promise<boolean> {
  let isAliInternal = nodeCache.get(cacheId);
  if (!isAliInternal) {
    isAliInternal = await checkAliInternal();
    nodeCache.set(cacheId, isAliInternal, cacheTimeoutSeconds);
  }
  return isAliInternal;
}

export function checkIsInstalledDoctor() {
  const doctorExtension = vscode.extensions.getExtension('iceworks-team.iceworks-doctor');
  return !!doctorExtension;
}
