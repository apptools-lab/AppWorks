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

const textInfoCache: {[name: string]: FileTextInfo} = {};
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
  update: number = 0; // 总共更新了多少次
  linesAdded: number = 0; // 添加了多少行
  linesRemoved: number = 0; // 删除了多少行
  start: number = 0; // 第一次开始更新文件的时间
  end: number = 0; // 最后一次结束更新文件的时间
  durationSeconds: number = 0; // 最后一次更新距离第一次开始更新的时间间隔

  constructor(fileName: string, project: Project) {
    const baseName = path.basename(fileName);
    const { nowInSec } = getNowTimes();

    this.name = baseName;
    this.fsPath = fileName;
    this.projectDir = project.directory;
    this.start = nowInSec;
  }

  updateTextInfo(textDocument: TextDocument) {
    const { syntax, length, lineCount } = getTextInfo(textDocument, this.name);
    this.syntax = syntax;
    this.length = length;
    this.lineCount = lineCount;
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
