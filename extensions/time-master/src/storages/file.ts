import * as path from 'path';
import * as fse from 'fs-extra';
import { TextDocument } from 'vscode';
import { getStorageDayPath } from '../utils/storage';
import { jsonSpaces } from '../config';
import logger from '../utils/logger';

let textInfoCache: {[fileName: string]: FileTextInfo} = {};
export function getTextInfo(textDocument: TextDocument, fileName: string): FileTextInfo {
  if (textInfoCache[fileName]) {
    return textInfoCache[fileName];
  }

  textInfoCache[fileName] = {
    syntax: textDocument?.languageId || textDocument?.fileName.split('.').slice(-1)[0] || '',
    length: textDocument?.getText().length || 0,
    lineCount: textDocument?.lineCount || 0,
  };
  return textInfoCache[fileName];
}

export function cleanTextInfoCache() {
  textInfoCache = {};
}

export interface KeystrokeStatsInfo {
  /**
   * Time to start keystroke
   */
  start: number;
  /**
   * Time to end keystroke
   */
  end: number;
  /**
   * Number of keystrokes
   */
  keystrokes: number;
  /**
   * Interval between the end of the update and the start of the update
   */
  durationSeconds: number;
}

export interface UsageStatsInfo {
  /**
   * Time to start usage
   */
  start: number;
  /**
   * Time to end usage
   */
  end: number;
  /**
   * Interval between the end of the usage and the start of the usage
   */
  durationSeconds: number;
}

export interface FileTextInfo {
  /**
   * The character length of the file
   */
  length: number;
  /**
   * The number of lines in the file
   */
  lineCount: number;
  /**
   * Syntax used by the file
   */
  syntax: string;
}

export interface FileInfo extends FileTextInfo {
  /**
   * Filename
   */
  fileName: string;
  /**
   * The path where the file is located
   */
  fsPath: string;
}

export interface FileEventInfo {
  /**
   * Open times
   */
  open: number;
  /**
   * Close times
   */
  close: number;
  /**
   * Update times
   */
  update: number;
}

export interface ContentChangeEventInfo {
  /**
   * Paste times
   */
  pasteTimes: number;
  /**
   * Add times
   */
  addTimes: number;
  /**
   * Delete times
   */
  deleteTimes: number;
}

export interface ContentChangeInfo {
  /**
   * How many lines have been added
   */
  linesAdded: number;
  /**
   * How many lines have been deleted
   */
  linesRemoved: number;
  /**
   * How many characters have been added
   */
  charsAdded?: number;
  /**
   * How many characters were deleted
   */
  charsDeleted?: number;
  /**
   * Number of characters pasted
   */
  charsPasted?: number;
}

export interface FileChangeInfo extends
  FileInfo,
  KeystrokeStatsInfo,
  FileEventInfo,
  ContentChangeInfo,
  ContentChangeEventInfo
{
  /**
   * The folder of the project to which the file belongs
   */
  projectDirectory: string;
}

export interface FileUsageInfo extends FileInfo, UsageStatsInfo {
  /**
   * The folder of the project to which the file belongs
   */
  projectDirectory: string;
}

export interface FileSummary extends
  FileInfo,
  FileEventInfo,
  ContentChangeInfo,
  ContentChangeEventInfo {
  /**
   * The folder of the project to which the file belongs
   */
  projectDirectory: string;
  /**
   * Keystrokes per minute
   */
  kpm: number;
  /**
   * Time used to edit files
   */
  sessionSeconds: number;
  /**
   * File editor usage time
   */
  editorSeconds: number;

  // KeystrokeStatsInfo
  startChange: PropType<KeystrokeStatsInfo, 'start'>;
  endChange: PropType<KeystrokeStatsInfo, 'end'>;
  keystrokes: PropType<KeystrokeStatsInfo, 'keystrokes'>;
  // UsageStatsInfo
  startUsage: PropType<UsageStatsInfo, 'start'>;
  endUsage: PropType<UsageStatsInfo, 'end'>;
}

export function getFileSummaryDefaults(): FileSummary {
  return {
    length: 0,
    lineCount: 0,
    syntax: '',
    fileName: '',
    fsPath: '',
    open: 0,
    close: 0,
    update: 0,
    pasteTimes: 0,
    addTimes: 0,
    deleteTimes: 0,
    linesAdded: 0,
    linesRemoved: 0,
    charsAdded: 0,
    charsDeleted: 0,
    charsPasted: 0,
    projectDirectory: '',
    kpm: 0,
    sessionSeconds: 0,
    editorSeconds: 0,
    startChange: 0,
    endChange: 0,
    keystrokes: 0,
    startUsage: 0,
    endUsage: 0,
  };
}

export interface FilesSummary {
  [filePath: string]: FileSummary;
}

function getFilesFile(day?: string) {
  // better names "files.json"
  // however, in order to be compatible with the existing data, please do not modify it
  return path.join(getStorageDayPath(day), 'filesChange.json');
}

async function getOriginFilesSummary(day?: string) {
  const file = getFilesFile(day);
  const fileIsExists = await fse.pathExists(file);
  return fileIsExists ? await fse.readJson(file) : {};
}

export async function getFilesSummary(day?: string): Promise<FilesSummary> {
  try {
    return await getOriginFilesSummary(day);
  } catch (e) {
    logger.error('[fileStorage][getFilesSummary] got error', e);
    return {};
  }
}

export async function saveFilesSummary(filesSummary: FilesSummary) {
  const file = getFilesFile();
  await fse.writeJson(file, filesSummary, { spaces: jsonSpaces });
}
