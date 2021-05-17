
import * as vscode from 'vscode';
import * as os from 'os';
import { getCommandResultLine } from './common';

// eslint-disable-next-line
const { name: extensionName, version: extensionVersion } = require('../../package.json');

// eslint-disable-next-line
const checkIsElectron = require('is-electron');

function getO2Version() {
  const O2Version = process.env.O2_VERSION;
  return O2Version;
}

export interface EditorInfo {
  editorName: string;
  editorVersion: string;
}

export function getEditorInfo(): EditorInfo {
  const o2Version = getO2Version();
  const isElectron = checkIsElectron();

  let editorName = vscode.env.appName;
  let editorVersion = vscode.version;
  if (o2Version) {
    editorVersion = o2Version;
    if (isElectron) {
      editorName = 'O2 Client';
    } else {
      editorName = 'O2 Online';
    }
  }

  return {
    editorName,
    editorVersion,
  };
}

export interface ExtensionInfo {
  extensionName: string;
  extensionVersion: string;
}

export function getExtensionInfo(): ExtensionInfo {
  return {
    extensionName,
    extensionVersion,
  };
}

function getOS() {
  const parts = [];
  const osType = os.type();
  if (osType) {
    parts.push(osType);
  }
  const osRelease = os.release();
  if (osRelease) {
    parts.push(osRelease);
  }
  const platform = os.platform();
  if (platform) {
    parts.push(platform);
  }
  return parts.join('_');
}

async function getHostname() {
  const hostname = await getCommandResultLine('hostname');
  return hostname;
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export interface SystemInfo {
  os: string;
  hostname: string;
  timezone: string;
}

let systemInfoCache;
export async function getSystemInfo(): Promise<SystemInfo> {
  if (systemInfoCache) {
    return systemInfoCache;
  }
  const osStr = getOS();
  const hostname = await getHostname();
  const timezone = getTimezone();
  systemInfoCache = { os: osStr, hostname, timezone };
  return systemInfoCache;
}
