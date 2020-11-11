import { getUserInfo, checkIsAliInternal } from '@iceworks/common-service';
import * as path from 'path';
import axios from 'axios';
import * as fse from 'fs-extra';
import { KeystrokeStats } from '../recorders/keystrokeStats';
import { FileChange } from '../storages/filesChange';
import { getAppDataDirPath } from './storage';
import { getEditorInfo, getExtensionInfo, getSystemInfo } from './env';
import forIn = require('lodash.forin');

const SESSION_TIME_RECORD = 'session_time';
const EDITOR_TIME_RECORD = 'editor_time';

export interface SessionTimePayload {
  fileName: string;
  fsPath: string;
  syntax: string;
  keystrokes: number;
  linesAdded: number;
  linesRemoved: number;
  start: number;
  end: number;
  durationSeconds: number;
  open: number;
  close: number;
  paste: number;
  update: number;
  add: number;
  delete: number;
  userId: string;
  // projectId: string;
  projectName: string;
  projectDirectory: string;
  gitRepository: string;
  gitBranch: string;
  gitTag: string;
  editorName: string;
  editorVersion: string;
  extensionName: string;
  extensionVersion: string;
  os: string;
  hostname: string;
  timezone: string;
}

export interface EditorTimePayload {
  durationSeconds: number;
  userId: string;
  // projectId: string;
  projectName: string;
  projectDirectory: string;
  gitRepository: string;
  gitBranch: string;
  gitTag: string;
  editorName: string;
  editorVersion: string;
  extensionName: string;
  extensionVersion: string;
  os: string;
  hostname: string;
  timezone: string;
}

/**
 * ONLY SEND DATA IN ALIBABA INTERNAL!!!
 */
async function checkIsSendable() {
  return await checkIsAliInternal();
}

function transformKeyStrokeStatsToSessionTimePayload(keystrokeStats: KeystrokeStats): SessionTimePayload[] {
  const data: SessionTimePayload[] = [];
  const { files, project } = keystrokeStats;
  const { name: projectName, directory: projectDirectory, resource } = project;
  const { repository: gitRepository, branch: gitBranch, tag: gitTag } = resource;
  forIn(files, (fileChange: FileChange) => {
    data.push({
      ...fileChange,
      fileName: fileChange.name,
      projectName,
      projectDirectory,
      gitRepository,
      gitBranch,
      gitTag,

      // placeholder
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

export async function appendSessionTimePayload(keystrokeStats: KeystrokeStats) {
  const isSendable = checkIsSendable();
  if (isSendable) {
    const playload = transformKeyStrokeStatsToSessionTimePayload(keystrokeStats);
    await appendPayloadData(SESSION_TIME_RECORD, playload);
  }
}

/**
 * TODO
 */
export async function appendEditorTimePayload() {
  // hold
}

export async function sendPayload() {
  await Promise.all([SESSION_TIME_RECORD, EDITOR_TIME_RECORD].map(async (TYPE) => {
    await sendPayloadData(TYPE);
  }));
}

async function send(api: string, originParam: any) {
  const param = {
    ...originParam,
    cache: Math.random(),
  };

  try {
    const dataKeyArray = Object.keys(param);
    const gokey = dataKeyArray.reduce((finalStr, currentKey, index) => {
      const currentData = typeof param[currentKey] === 'string' ? param[currentKey] : JSON.stringify(param[currentKey]);
      return `${finalStr}${currentKey}=${currentData}${dataKeyArray.length - 1 === index ? '' : '&'}`;
    }, '');

    await axios({
      method: 'post',
      url: `http://gm.mmstat.com/${api}`,
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        origin: 'https://www.taobao.com',
        referer: 'https://www.taobao.com/',
      },
      data: {
        gmkey: 'CLK',
        gokey: encodeURIComponent(gokey),
        logtype: '2',
      },
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * TODO batch send to server
 */
async function sendPayloadData(type: string) {
  const { empId } = await getUserInfo();
  const playload = getPayloadData(type);
  const { name: editorName, version: editorVersion } = getEditorInfo();
  const { name: extensionName, version: extensionVersion } = getExtensionInfo();
  const { os, hostname, timezone } = await getSystemInfo();
  await Promise.all(playload.map(async (record: any) => {
    await send(`iceteam.iceworks.time_master_${type}`, {
      ...record,
      userId: empId,
      editorName,
      editorVersion,
      extensionName,
      extensionVersion,
      os,
      hostname,
      timezone,
    });
  }));
  clearPayloadData(type);
}

function getPayloadData(type: string) {
  const file = getPayloadFile(type);
  let playload = [];
  try {
    playload = fse.readJSONSync(file);
  } catch (e) {
    // ignore error
  }
  return playload;
}

function clearPayloadData(type: string) {
  savePayloadData(type, []);
}

function savePayloadData(type: string, playload: EditorTimePayload[]|SessionTimePayload[]) {
  const file = getPayloadFile(type);
  fse.writeJSONSync(file, playload);
}

function appendPayloadData(type: string, data: EditorTimePayload[]|SessionTimePayload[]) {
  const playload = getPayloadData(type);
  const nextData = playload.concat(data);
  savePayloadData(type, nextData);
}

function getPayloadFile(type: string) {
  return path.join(getAppDataDirPath(), `${type}_records.json`);
}
