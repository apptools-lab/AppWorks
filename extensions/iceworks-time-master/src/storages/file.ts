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
    syntax: textDocument.languageId || textDocument.fileName.split('.').slice(-1)[0],
    length: textDocument.getText().length || 0,
    lineCount: textDocument.lineCount || 0,
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

export interface WatchStatsInfo {
  /**
   * Time to start watch
   */
  start: number;
  /**
   * Time to end watch
   */
  end: number;
  /**
   * Interval between the end of the watch and the start of the watch
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
  // TODO Remove it
  FileEventInfo,
  KeystrokeStatsInfo,
  ContentChangeInfo,
  ContentChangeEventInfo
{
  /**
   * The folder of the project to which the file belongs
   */
  projectDirectory: string;
}

export interface FileWatchInfo extends FileInfo, WatchStatsInfo {
  /**
   * The folder of the project to which the file belongs
   */
  projectDirectory: string;
}

export interface FileSummary extends FileInfo, Omit<KeystrokeStatsInfo, 'durationSeconds'>, FileEventInfo, ContentChangeInfo, ContentChangeEventInfo {
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
  editorSeconds?: number;
}

export interface FilesSummary {
  [filePath: string]: FileSummary;
}

export function getFilesFile() {
  // better names "files.json"
  // however, in order to be compatible with the existing data, please do not modify it
  return path.join(getStorageDayPath(), 'filesChange.json');
}

export async function getFilesSummary(): Promise<FilesSummary> {
  const file = getFilesFile();
  let filesSummary = {};
  try {
    filesSummary = await fse.readJson(file);
  } catch (e) {
    logger.error('[fileChangeStorage][getFilesSummary] got error', e);
  }
  return filesSummary;
}

export async function saveFilesSummary(filesSummary: FilesSummary) {
  const file = getFilesFile();
  await fse.writeJson(file, filesSummary, { spaces: jsonSpaces });
}

export async function cleanFilesSummary() {
  await saveFilesSummary({});
}
