import { exec } from 'child_process';
import { workspace, TextDocument } from 'vscode';
import logger from './logger';

export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(true), time));

export function isFileActive(file: string): boolean {
  if (workspace.textDocuments) {
    for (let i = 0; i < workspace.textDocuments.length; i++) {
      const doc: TextDocument = workspace.textDocuments[i];
      if (doc.fileName === file) {
        return true;
      }
    }
  }
  return false;
}

export async function wrapExecPromise(cmd: string, cwd: string) {
  let result = '';
  try {
    result = await execPromise(cmd, { cwd });
  } catch (e) {
    logger.error('[utils][common][wrapExecPromise] got error:', e.message);
  }
  return result;
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

export async function getCommandResultLine(cmd: string, cwd = '') {
  const resultList = await getCommandResultList(cmd, cwd);
  let resultLine = '';
  if (resultList && resultList.length) {
    for (let i = 0; i < resultList.length; i++) {
      const line = resultList[i];
      if (line && line.trim().length > 0) {
        resultLine = line.trim();
        break;
      }
    }
  }
  return resultLine;
}

async function getCommandResultList(cmd: string, cwd = '') {
  const result = await wrapExecPromise(`${cmd}`, cwd);
  if (!result) {
    return [];
  }
  const contentList = result
    .replace(/\r\n/g, '\r')
    .replace(/\n/g, '\r')
    .split(/\r/);
  return contentList;
}
