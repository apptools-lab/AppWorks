import { checkIsAliInternal } from '@iceworks/common-service';
import { getUserInfo } from '@iceworks/user-service';
import * as path from 'path';
import axios from 'axios';
import * as fse from 'fs-extra';
import { ALI_DIP_PRO } from '@iceworks/constant';
import { KeystrokeStats, FileChange } from '../recorders/keystrokeStats';
import { FileChangeInfo, FileEventInfo, FileUsageInfo } from '../storages/file';
import { getStoragePayloadsPath } from './storage';
import { getEditorInfo, getExtensionInfo, getSystemInfo, SystemInfo, EditorInfo, ExtensionInfo } from './env';
import { ProjectInfo } from '../storages/project';
import { window } from 'vscode';
import logger from './logger';
import { ONE_SEC_MILLISECONDS } from '../constants';
import { FileUsage, UsageStats } from '../recorders/usageStats';

// eslint-disable-next-line
import forIn = require('lodash.forin');

const KEYSTROKES_RECORD = 'keystrokes';
const USAGES_RECORD = 'usages';

const url = `${ALI_DIP_PRO}/api`;

interface ProjectParams extends Omit<ProjectInfo, 'name'|'directory'> {
  projectName: PropType<ProjectInfo, 'name'>;
  projectDirectory: PropType<ProjectInfo, 'directory'>;
}

interface UserInfo {
  userId: string;
}

export interface KeystrokesPayload extends
  ProjectParams,
  EditorInfo,
  ExtensionInfo,
  SystemInfo,
  UserInfo,
  Omit<FileChangeInfo, keyof FileEventInfo> {
}

export interface UsagePayload extends
  ProjectParams,
  EditorInfo,
  ExtensionInfo,
  SystemInfo,
  UserInfo,
  FileUsageInfo {
}

/**
 * ONLY SEND DATA IN ALIBABA INTERNAL!!!
 */
async function checkIsSendable() {
  // TODO
  // checkIsAliInternal is judged by network environment
  // There is a situation: the user is a member of Alibaba,
  // but he works at home does not connect to the intranet.
  const isAliInternal = await checkIsAliInternal();
  return isAliInternal;
}

function checkIsSendNow(): boolean {
  // Prevent multi window resource competition
  return window.state.focused;
}

function transformDataToPayload(keystrokeStats: KeystrokeStats|UsageStats):
Array<KeystrokesPayload|UsagePayload> {
  const data: Array<KeystrokesPayload|UsagePayload> = [];
  const { files, project } = keystrokeStats;
  const { name: projectName, directory: projectDirectory, gitRepository, gitBranch, gitTag } = project;
  const defaultValues = {
    projectName,
    projectDirectory,
    gitRepository,
    gitBranch,
    gitTag,

    // placeholder, will fill it before send
    userId: '',
    editorName: '',
    editorVersion: '',
    extensionName: '',
    extensionVersion: '',
    os: '',
    hostname: '',
    timezone: '',
  };
  forIn(files, (file: FileChange|FileUsage) => {
    data.push({
      ...file,
      ...defaultValues,
    });
  });
  return data;
}

export async function appendKeystrokesPayload(keystrokeStats: KeystrokeStats) {
  const playload = transformDataToPayload(keystrokeStats);
  logger.info('[sender][appendKeystrokesPayload] playload length:', playload.length);
  await appendPayloadData(KEYSTROKES_RECORD, playload);
}

export async function appendUsageTimePayload(usageStats: UsageStats) {
  const playload = transformDataToPayload(usageStats);
  logger.info('[sender][appendUsageTimePayload] playload length:', playload.length);
  await appendPayloadData(USAGES_RECORD, playload);
}

export async function sendPayload(force?: boolean) {
  logger.info('[sender][sendPayload] run, force:', force);
  const isSendable = await checkIsSendable();
  const isSendNow = checkIsSendNow();
  await Promise.all([KEYSTROKES_RECORD, USAGES_RECORD].map(async (TYPE) => {
    logger.info(`[sender][sendPayload] ${TYPE} isSendable: ${isSendable}`);
    if (isSendable) {
      logger.info(`[sender][sendPayload] ${TYPE} isSendNow: ${isSendNow}`);
      if (isSendNow || force) {
        await sendPayloadData(TYPE);
      }
    } else {
      await clearPayloadData(TYPE);
    }
  }));
}

const timeout = ONE_SEC_MILLISECONDS * 5;
async function send(api: string, data: any) {
  const response = await axios({
    method: 'post',
    url: `${url}${api}`,
    timeout,
    data: {
      data,
    },
  });
  return response;
}

export function isResponseOk(response) {
  return response.status === 200 && response.data && response.data.success;
}

/**
 * If payload is too large, may be a large number of requests errors
 */
export async function checkPayloadIsLimited() {
  const playloadLimit = 1024 * 1024 * 10; // mb
  await Promise.all([KEYSTROKES_RECORD, USAGES_RECORD].map(async (TYPE) => {
    const file = getPayloadFile(TYPE);
    const fileIsExists = await fse.pathExists(file);
    if (fileIsExists) {
      const { size } = await fse.stat(file);
      if (size > playloadLimit) {
        await clearPayloadData(TYPE);
        logger.error('[sender][checkPayloadIsLimited]payload is limited, size: ', size);
      }
    }
  }));
}

async function sendBulkCreate(type, playloadData, extra) {
  logger.info(`[sender][sendBulkCreate] run, ${type}'s playloadData: ${playloadData.length}`);
  try {
    const bulkCreateResponse = await send(`/${type}/_bulkCreate`, playloadData.map((record: any) => ({
      ...record,
      ...extra,
    })));

    if (!isResponseOk(bulkCreateResponse)) {
      logger.info(`[sender][sendBulkCreate] response: status(${bulkCreateResponse.status}), statusText(${bulkCreateResponse.statusText}), data(${bulkCreateResponse.data})`);
      throw new Error(bulkCreateResponse.data.message);
    }
  } catch (e) {
    // if got error, write back the data and resend it in the next cycle
    await appendPayloadData(type, playloadData);
    logger.error('[sender][sendBulkCreate] got error:', e);
    throw e;
  }
}

async function sendPayloadData(type: string) {
  // TODO get user info may fail
  const { empId } = await getUserInfo();
  const playload = await getPayloadData(type);
  const playloadLength = playload.length;

  logger.info(`[sender][sendPayloadData] run, ${type}'s playloadLength: ${playloadLength}`);
  if (Array.isArray(playload) && playloadLength) {
    // clear first to prevent duplicate sending when concurrent
    await clearPayloadData(type);

    const editorInfo = getEditorInfo();
    const extensionInfo = getExtensionInfo();
    const systemInfo = await getSystemInfo();
    const extra = {
      ...editorInfo,
      ...extensionInfo,
      ...systemInfo,
      userId: empId,
    };

    if (playloadLength > 100) {
      const batchPlayloadList = [];
      while (playload.length) {
        batchPlayloadList.push(playload.splice(0, 10));
      }
      await Promise.all(batchPlayloadList.map(async (batchPlayload) => {
        await sendBulkCreate(type, batchPlayload, extra);
      }));
    } else {
      await sendBulkCreate(type, playload, extra);
    }
  }
}

async function getPayloadData(type: string) {
  const file = getPayloadFile(type);
  let playload = [];
  try {
    playload = await fse.readJson(file);
  } catch (e) {
    // ignore error
  }
  return playload;
}

async function clearPayloadData(type: string) {
  await fse.remove(getPayloadFile(type));
}

async function savePayloadData(type: string, playload: UsagePayload[]|KeystrokesPayload[]) {
  const file = getPayloadFile(type);
  await fse.writeJson(file, playload);
}

async function appendPayloadData(type: string, data: UsagePayload[]|KeystrokesPayload[]) {
  const playload = await getPayloadData(type);
  const nextData = playload.concat(data);
  await savePayloadData(type, nextData);
}

function getPayloadFile(type: string) {
  return path.join(getStoragePayloadsPath(), `${type}.json`);
}
