import { getUserInfo, checkIsAliInternal } from '@iceworks/common-service';
import * as path from 'path';
import axios from 'axios';
import * as fse from 'fs-extra';
import { ALI_DIP_DAILY } from '@iceworks/constant';
import { KeystrokeStats } from '../recorders/keystrokeStats';
import { FileChange, FileChangeInfo, FileEventInfo } from '../storages/filesChange';
import { getStoragePayloadsPath } from './storage';
import { getEditorInfo, getExtensionInfo, getSystemInfo, SystemInfo, EditorInfo, ExtensionInfo } from './env';
import { ProjectInfo } from '../storages/project';
import { window } from 'vscode';
import logger from './logger';
import { sendPayloadDuration } from '../config';
import forIn = require('lodash.forin');

const KEYSTROKES_RECORD = 'keystrokes';
const EDITOR_TIME_RECORD = 'editor_time';

const url = `${ALI_DIP_DAILY}/api`;

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

export interface EditorTimePayload extends ProjectParams, EditorInfo, ExtensionInfo, SystemInfo, UserInfo {
  durationSeconds: number;
}

/**
 * ONLY SEND DATA IN ALIBABA INTERNAL!!!
 */
async function checkIsSendable() {
  return await checkIsAliInternal();
}

function checkIsSendNow(): boolean {
  // Prevent multi window resource competition
  return window.state.focused;
}

function transformKeyStrokeStatsToKeystrokesPayload(keystrokeStats: KeystrokeStats): KeystrokesPayload[] {
  const data: KeystrokesPayload[] = [];
  const { files, project } = keystrokeStats;
  const { name: projectName, directory: projectDirectory, gitRepository, gitBranch, gitTag } = project;
  forIn(files, (fileChange: FileChange) => {
    data.push({
      ...fileChange,
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
    });
  });
  return data;
}

export async function appendKeystrokesPayload(keystrokeStats: KeystrokeStats) {
  const playload = transformKeyStrokeStatsToKeystrokesPayload(keystrokeStats);
  await appendPayloadData(KEYSTROKES_RECORD, playload);
}

/**
 * TODO
 */
export async function appendEditorTimePayload() {
  // hold
}

export async function sendPayload(force?: boolean) {
  const isSendable = await checkIsSendable();
  const isSendNow = checkIsSendNow();
  await Promise.all([KEYSTROKES_RECORD, EDITOR_TIME_RECORD].map(async (TYPE) => {
    if (isSendable) {
      if (isSendNow || force) {
        await sendPayloadData(TYPE);
      }
    } else {
      await clearPayloadData(TYPE);
    }
  }));
}

async function send(api: string, data: any) {
  return await axios({
    method: 'post',
    url: `${url}${api}`,
    data: {
      data,
    },
  });
}

export function isResponseOk(response) {
  return response.status === 200 && response.data && response.data.success;
}

/**
 * If payload is too large, may be a large number of requests errors
 */
export async function checkPayloadIsLimited() {
  const playloadLimit = 1024 * 1024 * 10; // mb
  await Promise.all([KEYSTROKES_RECORD, EDITOR_TIME_RECORD].map(async (TYPE) => {
    const file = getPayloadFile(TYPE);
    const { size } = await fse.stat(file);
    if (size > playloadLimit) {
      await clearPayloadData(TYPE);
      logger.error('[sender][checkPayloadIsLimited]payload is limited, size: ', size);
    }
  }));
}

async function sendPayloadData(type: string) {
  const { empId } = await getUserInfo();
  const playload = await getPayloadData(type);
  const playloadLength = playload.length;

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

    if (playloadLength > sendPayloadDuration) {
      logger.debug('[sender][sendPayloadData]_bulkCreate run', playloadLength);
      try {
        const bulkCreateRespose = await send(`/${type}/_bulkCreate`, playload.map((record: any) => ({
          ...record,
          ...extra,
        })));

        logger.debug('[sender][sendPayloadData]_bulkCreate response', bulkCreateRespose);
        if (!isResponseOk(bulkCreateRespose)) {
          throw new Error(bulkCreateRespose.data.message);
        }
      } catch (e) {

        // if got error, write back the data and resend it in the next cycle
        await appendPayloadData(type, playload);
        logger.error('[sender][sendPayloadData]_bulkCreate got error:', e);
        throw e;
      }
    } else {
      logger.debug('[sender][sendPayloadData]_create run:', playloadLength);
      const failRecords = await Promise.all(playload.map(async (record: any) => {
        try {
          const createResponse = await send(`/${type}/_create`, {
            ...record,
            ...extra,
          });
          logger.debug('[sender][sendPayloadData]_create response', createResponse);
          if (!isResponseOk(createResponse)) {
            throw new Error(createResponse.data.message);
          }
        } catch (e) {
          logger.error('[sender][sendPayloadData]_create got error:', e);
          return record;
        }
      }));

      // if got error, write back the data and resend it in the next cycle
      const failPayload = failRecords.filter((failRecord) => failRecord);
      await appendPayloadData(type, failPayload);
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

async function savePayloadData(type: string, playload: EditorTimePayload[]|KeystrokesPayload[]) {
  const file = getPayloadFile(type);
  await fse.writeJson(file, playload);
}

async function appendPayloadData(type: string, data: EditorTimePayload[]|KeystrokesPayload[]) {
  const playload = await getPayloadData(type);
  const nextData = playload.concat(data);
  await savePayloadData(type, nextData);
}

function getPayloadFile(type: string) {
  return path.join(getStoragePayloadsPath(), `${type}.json`);
}
