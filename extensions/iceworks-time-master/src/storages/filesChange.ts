import * as path from 'path';
import * as fse from 'fs-extra';
import { TextDocument } from 'vscode';
import { getAppDataDayDirPath } from '../utils/storage';
import { getNowTimes } from '../utils/time';
import { Project } from './project';
import { KeystrokeStats } from '../managers/keystrokeStats';
import { JSON_SPACES } from '../constants';
import forIn = require('lodash.forin');

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

let textInfoCache: {[name: string]: FileTextInfo} = {};
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

export interface FileChangeSummary {
  /**
   * Filename
   */
  name: string;
  /**
   * The path where the file is located
   */
  fsPath: string;
  /**
   * The folder of the project to which the file belongs
   */
  projectDir: string;
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

  /**
   * Keystrokes per minute
   */
  kpm: number;
  /**
   * Number of keystrokes
   */
  keystrokes: number;
  /**
   * File editor usage time
   */
  editorSeconds?: number;
  /**
   * Time used to edit files
   */
  sessionSeconds: number;

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

  /**
   * File open times
   */
  open: number;
  /**
   * File close times
   */
  close: number;
  /**
   * File update times
   */
  update: number;

  /**
   * Paste times
   */
  paste: number;
  /**
   * Add times
   */
  add: number;
  /**
   * Delete times
   */
  delete: number;

  /**
   * How many lines have been added
   */
  linesAdded: number;
  /**
   * How many lines have been deleted
   */
  linesRemoved: number;

  /**
   * Time to start updating files
   */
  start: number;
  /**
   * End time to update file
   */
  end: number;
}

export class FileChange {
  public name: string;

  public fsPath: string;

  public projectDir: string;

  public length: number;

  public lineCount: number;

  public syntax: string;

  public kpm = 0;

  public keystrokes = 0;

  public charsAdded = 0;

  public charsDeleted = 0;

  public charsPasted = 0;

  public open = 0;

  public close = 0;

  public paste = 0;

  public add = 0;

  public delete = 0;

  public update = 0;

  public linesAdded = 0;

  public linesRemoved = 0;

  public start = 0;

  public end = 0;

  /**
   * Interval between
   * the end of the update and
   * the beginning of the update
   */
  public durationSeconds = 0;

  constructor(values?: any) {
    if (values) {
      Object.assign(this, values);
    }
  }

  updateTextInfo(textDocument: TextDocument) {
    const { syntax, length, lineCount } = getTextInfo(textDocument, this.name);
    this.syntax = syntax;
    this.length = length;
    this.lineCount = lineCount;
  }

  activate() {
    // placeholder
  }

  deactivate() {
    this.update = 1;
    this.kpm = this.keystrokes;
    this.durationSeconds = this.end - this.start;
  }

  setStart(time?: number) {
    this.start = time || getNowTimes().nowInSec;
  }

  setEnd(time?: number) {
    this.end = time || getNowTimes().nowInSec;
  }

  static createInstance(fsPath: string, project: Project) {
    const baseName = path.basename(fsPath);
    const name = baseName;
    const projectDir = project.directory;
    const fileChange = new FileChange({ name, projectDir, fsPath });
    return fileChange;
  }
}

export interface FilesChangeSummary {
  [name: string]: FileChangeSummary;
}

export function getFilesChangeFile() {
  return path.join(getAppDataDayDirPath(), 'filesChange.json');
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
  await fse.writeJson(file, filesChangeSummary, { spaces: JSON_SPACES });
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
      fileChangeSummary = { ...fileChange, sessionSeconds: fileChange.durationSeconds };
    } else {
      // aggregate
      fileChangeSummary.update += 1;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.kpm = fileChangeSummary.keystrokes / fileChangeSummary.update;
      fileChangeSummary.add += fileChange.add;
      fileChangeSummary.close += fileChange.close;
      fileChangeSummary.delete += fileChange.delete;
      fileChangeSummary.keystrokes += fileChange.keystrokes;
      fileChangeSummary.linesAdded += fileChange.linesAdded;
      fileChangeSummary.linesRemoved += fileChange.linesRemoved;
      fileChangeSummary.open += fileChange.open;
      fileChangeSummary.paste += fileChange.paste;
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
