import { getUserInfo, checkIsAliInternal } from '@iceworks/common-service';
import * as path from 'path';
import axios from 'axios';
import * as fse from 'fs-extra';
import { KeystrokeStats } from '../managers/keystrokeStats';
import { FileChange } from '../storages/filesChange';
import { getAppDataDir, getEditorInfo, getExtensionInfo, getSystemInfo } from '../utils/common';
import forIn = require('lodash.forin');

const SESSION_TIME_RECORD = 'session_time';
const EDITOR_TIME_RECORD = 'editor_time';

export interface SessionTimeRecord {
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

export interface EditorTimeRecord {
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

function transformKeyStrokeStatsToRecord(keystrokeStats: KeystrokeStats): SessionTimeRecord[] {
  const records: SessionTimeRecord[] = [];
  const { files, project } = keystrokeStats;
  const { name: projectName, directory: projectDirectory, resource } = project;
  const { repository: gitRepository, branch: gitBranch, tag: gitTag } = resource;
  forIn(files, (fileChange: FileChange) => {
    records.push({
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
  return records;
}

export async function recordSessionTime(keystrokeStats: KeystrokeStats) {
  const records = transformKeyStrokeStatsToRecord(keystrokeStats);
  await appendRecordsData(SESSION_TIME_RECORD, records);
}

/**
 * TODO
 */
export async function recordEditorTime() {
  // hold
}

export async function sendRecords() {
  if (!await checkIsAliInternal()) {
    return;
  }
  await sendRecordsData(SESSION_TIME_RECORD);
  await sendRecordsData(EDITOR_TIME_RECORD);
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
async function sendRecordsData(type: string) {
  const { empId } = await getUserInfo();
  const records = getRecordsData(type);
  const { name: editorName, version: editorVersion } = getEditorInfo();
  const { name: extensionName, version: extensionVersion } = getExtensionInfo();
  const { os, hostname, timezone } = await getSystemInfo();
  await Promise.all(records.map(async (record: any) => {
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
  clearRecordsData(type);
}

function getRecordsData(type: string) {
  const file = getRecordsFile(type);
  let records = [];
  try {
    records = fse.readJSONSync(file);
  } catch (e) {
    // ignore error
  }
  return records;
}

function clearRecordsData(type: string) {
  saveRecordsData(type, []);
}

function saveRecordsData(type: string, records: EditorTimeRecord[]|SessionTimeRecord[]) {
  const file = getRecordsFile(type);
  fse.writeJSONSync(file, records);
}

function appendRecordsData(type: string, data: EditorTimeRecord[]|SessionTimeRecord[]) {
  const records = getRecordsData(type);
  const nextData = records.concat(data);
  saveRecordsData(type, nextData);
}

function getRecordsFile(type: string) {
  return path.join(getAppDataDir(), `${type}_records.json`);
}