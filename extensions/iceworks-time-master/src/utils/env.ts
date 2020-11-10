
import * as vscode from 'vscode';
import * as os from 'os';
import { getCommandResultLine } from './common';

// eslint-disable-next-line
const { name, version } = require('../../package.json');

export function getEditorInfo() {
  return {
    name: vscode.env.appName,
    version: vscode.version,
  };
}

export function getExtensionInfo() {
  return {
    name,
    version,
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

export async function getSystemInfo() {
  const osStr = getOS();
  const hostname = getHostname();
  const timezone = getTimezone();
  return { os: osStr, hostname, timezone };
}
