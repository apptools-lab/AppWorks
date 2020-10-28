import * as path from 'path';
import * as fse from 'fs-extra';
import { TextDocument } from 'vscode';
import { getAppDataDir, getNowTimes } from '../utils/common';
import { Project } from './project';

interface FileTextInfo {
  /**
   * 文件字符长度
   */
  length: number;
  /**
   * 文件行数
   */
  lineCount: number;
  /**
   * 文件使用的语法
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

export class FileChangeSummary {
  /**
   * 文件名
   */
  private name: string;
  /**
   * 文件路径
   */
  private fsPath: string;
  /**
   * 文件所属的项目文件夹
   */
  private projectDir: string;
  private length: number;
  private lineCount: number;
  private syntax: string;

  kpm: number = 0; // kpm
  keystrokes: number = 0; // 按键数
  editorSeconds: number = 0; // 文件停留时间
  sessionSeconds: number = 0; // 文件编辑时间

  charsAdded: number = 0; // 添加了多少个字符
  charsDeleted: number = 0; // 删除了多少个字符
  charsPasted: number = 0; // 粘贴的字符数

  open: number = 0; // 文件打开次数
  close: number = 0; // 文件关闭次数
  paste: number = 0; // 粘贴次数
  add: number = 0; // 添加次数
  delete: number = 0; // 删除次数

  linesAdded: number = 0; // 添加了多少行
  linesRemoved: number = 0; // 删除了多少行

  /**
   * 开始更新文件的时间
   */
  private start: number = 0;
  /**
   * 结束更新文件的时间
   */
  private end: number = 0;
  /**
   * 更新距离开始更新的时间间隔
   */
  private durationSeconds: number = 0;

  constructor(fileName: string, project: Project) {
    const baseName = path.basename(fileName);
    const { nowInSec } = getNowTimes();

    this.name = baseName;
    this.fsPath = fileName;
    this.projectDir = project.directory;
    this.setStart(nowInSec);
  }

  updateTextInfo(textDocument: TextDocument) {
    const { syntax, length, lineCount } = getTextInfo(textDocument, this.name);
    this.syntax = syntax;
    this.length = length;
    this.lineCount = lineCount;
  }

  setStart(time: number) {
    this.start = time;
  }

  setEnd(time: number) {
    this.end = time;
    this.durationSeconds = this.end - this.start;
  }

  getEnd() {
    return this.end;
  }
}

export interface FilesChangeSummary {
  [name: string]: FileChangeSummary;
}

export function getFileChangeFile() {
  return path.join(getAppDataDir(), 'filesChange.json');
}

export function getFilesChangeSummary(): FilesChangeSummary {
  const file = getFileChangeFile();
  const filesChangeSummary = fse.readJsonSync(file);
  return filesChangeSummary;
}

export function saveFilesChangeSummary(filesChangeSummary: FilesChangeSummary) {
  const file = getFileChangeFile();
  fse.writeJsonSync(file, filesChangeSummary, { spaces: 4 });
}
