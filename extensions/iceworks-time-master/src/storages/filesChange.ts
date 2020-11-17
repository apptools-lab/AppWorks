import * as path from 'path';
import * as fse from 'fs-extra';
import { TextDocument } from 'vscode';
import { getStorageDayPath } from '../utils/storage';
import { getNowUTCSec } from '../utils/time';
import { Project } from './project';
import { jsonSpaces } from '../config';
import { KeystrokeStatsInfo, KeystrokeStats } from '../recorders/keystrokeStats';
import forIn = require('lodash.forin');

let textInfoCache: {[fileName: string]: FileTextInfo} = {};
function getTextInfo(textDocument: TextDocument, fileName: string): FileTextInfo {
  if (textInfoCache[fileName]) {
    return textInfoCache[fileName];
  }

  textInfoCache[fileName] = {
    syntax: textDocument.languageId || textDocument.fileName.split('.').slice(-1)[0],
    length: textDocument.getText().length,
    lineCount: textDocument.lineCount || 0,
  };
  return textInfoCache[fileName];
}

export function cleanTextInfoCache() {
  textInfoCache = {};
}

interface FileTextInfo {
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

export interface FileChangeSummary extends FileInfo, Omit<KeystrokeStatsInfo, 'durationSeconds'>, FileEventInfo, ContentChangeInfo, ContentChangeEventInfo {
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

export class FileChange implements FileChangeInfo {
  public fileName: string;

  public fsPath: string;

  public projectDirectory: string;

  public length: number;

  public lineCount: number;

  public syntax: string;

  public keystrokes = 0;

  public charsAdded = 0;

  public charsDeleted = 0;

  public charsPasted = 0;

  public open = 0;

  public close = 0;

  public pasteTimes = 0;

  public addTimes = 0;

  public deleteTimes = 0;

  public update = 0;

  public linesAdded = 0;

  public linesRemoved = 0;

  public start = 0;

  public end = 0;

  public durationSeconds = 0;

  constructor(values?: Partial<FileChangeInfo>) {
    if (values) {
      Object.assign(this, values);
    }
  }

  updateTextInfo(textDocument: TextDocument) {
    const { syntax, length, lineCount } = getTextInfo(textDocument, this.fileName);
    this.syntax = syntax;
    this.length = length;
    this.lineCount = lineCount;
  }

  activate() {
    // placeholder
  }

  deactivate() {
    this.update = 1;
    this.durationSeconds = this.end - this.start;
  }

  setStart(time?: number) {
    this.start = time || getNowUTCSec();
  }

  setEnd(time?: number) {
    this.end = time || getNowUTCSec();
  }

  static createInstance(fsPath: string, project: Project) {
    const baseName = path.basename(fsPath);
    const fileName = baseName;
    const projectDirectory = project.directory;
    const fileChange = new FileChange({ fileName, projectDirectory, fsPath });
    return fileChange;
  }
}

export interface FilesChangeSummary {
  [filePath: string]: FileChangeSummary;
}

export function getFilesChangeFile() {
  return path.join(getStorageDayPath(), 'filesChange.json');
}

export async function getFilesChangeSummary(): Promise<FilesChangeSummary> {
  const file = getFilesChangeFile();
  let filesChangeSummary = {};
  try {
    filesChangeSummary = await fse.readJson(file);
  } catch (e) {
    // ignore error
  }
  return filesChangeSummary;
}

export async function saveFilesChangeSummary(filesChangeSummary: FilesChangeSummary) {
  const file = getFilesChangeFile();
  await fse.writeJson(file, filesChangeSummary, { spaces: jsonSpaces });
}

export async function cleanFilesChangeSummary() {
  await saveFilesChangeSummary({});
}

export async function updateFilesChangeSummary(keystrokeStats: KeystrokeStats) {
  const { files } = keystrokeStats;
  let linesAdded = 0;
  let linesRemoved = 0;
  let keystrokes = 0;
  let sessionSeconds = 0;
  const filesChangeSummary = await getFilesChangeSummary();
  forIn(files, (fileChange: FileChange, fsPath: string) => {
    let fileChangeSummary = filesChangeSummary[fsPath];
    if (!fileChangeSummary) {
      fileChangeSummary = {
        ...fileChange,
        sessionSeconds: fileChange.durationSeconds,
        kpm: fileChange.keystrokes,
      };
    } else {
      // aggregate
      fileChangeSummary.update += 1;
      fileChangeSummary.open += fileChange.open;
      fileChangeSummary.close += fileChange.close;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.kpm = fileChangeSummary.keystrokes / fileChangeSummary.update;
      fileChangeSummary.addTimes += fileChange.addTimes;
      fileChangeSummary.deleteTimes += fileChange.deleteTimes;
      fileChangeSummary.pasteTimes += fileChange.pasteTimes;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.linesAdded += fileChange.linesAdded;
      fileChangeSummary.linesRemoved += fileChange.linesRemoved;
      fileChangeSummary.sessionSeconds += fileChange.durationSeconds;
      // non aggregates, just set
      fileChangeSummary.lineCount = fileChange.lineCount;
      fileChangeSummary.length = fileChange.length;
      fileChangeSummary.end = fileChange.end;
    }
    keystrokes += fileChange.keystrokes;
    linesAdded += fileChange.linesAdded;
    linesRemoved += fileChange.linesRemoved;
    sessionSeconds += fileChange.durationSeconds;
    filesChangeSummary[fsPath] = fileChangeSummary;
  });
  await saveFilesChangeSummary(filesChangeSummary);
  return {
    linesAdded,
    linesRemoved,
    keystrokes,
    sessionSeconds,
  };
}
