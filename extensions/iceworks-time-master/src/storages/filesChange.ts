import * as path from 'path';
import * as fse from 'fs-extra';
import { getAppDataDir } from '../utils';

export interface FileChangeSummary {
  // ==== 文件信息 ====
  name: string; // 文件名
  fsPath: string; // 文件路径
  projectDir: string; // 文件所属的项目文件夹
  length: number; // 文件字符长度
  lines: number; // 文件行数
  syntax: string; // 使用的语法

  // ==== 文件编辑信息 ====
  kpm: number; // kpm
  keystrokes: number; // 按键数
  editorSeconds: number; // 文件停留时间
  sessionSeconds: number; // 文件编辑时间
  charsAdded: number; // 添加了多少个字符
  charsDeleted: number; // 删除了多少个字符
  charsPasted: number; // 粘贴的字符数
  open: number; // 文件打开次数
  close: number; // 文件关闭次数
  paste: number; // 粘贴次数
  update: number; // 总共更新了多少次
  linesAdded: number; // 添加了多少行
  linesRemoved: number; // 删除了多少行
  start: number; // 第一次开始更新文件的时间
  end: number; // 最后一次结束更新文件的时间
  durationSeconds: number; // 最后一次更新距离第一次开始更新的时间间隔
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
