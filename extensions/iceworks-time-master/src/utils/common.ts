import { exec } from 'child_process';
import { window, workspace, TextDocument } from 'vscode';

/**
 * @param num {number} The number to round
 * @param precision {number} The number of decimal places to preserve
 */
export function roundUp(num: number, precision: number) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

export async function openFileInEditor(file: string) {
  try {
    const doc = await workspace.openTextDocument(file);
    try {
      await window.showTextDocument(doc, 1, false);
    } catch (e) {
      // ignore error
    }
  } catch (error) {
    if (
      error.message &&
      error.message.toLowerCase().includes('file not found')
    ) {
      window.showErrorMessage(`Cannot open ${file}. File not found.`);
    } else {
      console.error(error);
    }
  }
}

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

export async function wrapExecPromise(cmd: string, projectDir: string) {
  let result = '';
  try {
    result = await execPromise(cmd, { cwd: projectDir });
  } catch (e) {
    console.error(e.message);
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

/**
 * TODO Replace with community pack
 */
export function logIt(...args: any) {
  args[0] = `TimeMaster: ${ args[0]}`;
  console.log.apply(null, args);
}


export async function getCommandResultLine(cmd: string, projectDir = '') {
  const resultList = await getCommandResultList(cmd, projectDir);
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

async function getCommandResultList(cmd: string, projectDir = '') {
  const result = await wrapExecPromise(`${cmd}`, projectDir);
  if (!result) {
    return [];
  }
  const contentList = result
    .replace(/\r\n/g, '\r')
    .replace(/\n/g, '\r')
    .split(/\r/);
  return contentList;
}
