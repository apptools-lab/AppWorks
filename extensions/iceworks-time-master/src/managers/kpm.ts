import { TextDocument, TextDocumentChangeEvent, WindowState, window } from 'vscode';
import { isFileActive, getProjectPathForFile, getNowTimes } from '../utils/common';
import { Project } from '../storages/project';
import { NO_PROJ_NAME, DEFAULT_DURATION_MILLISECONDS } from '../constants';
import { KeystrokeStats } from '../keystrokeStats';
import { FileChangeSummary } from '../storages/filesChange';

interface FileInfo {
  fileName: string;
  languageId: string;
  length: number;
  lineCount: number;
}

const fileInfoCache: {[name: string]: FileInfo} = {};
const keystrokeStatsMap: {[projectPath: string]: KeystrokeStats} = {};

export class KpmManager {
  /**
  * This will return true if it's a validated file.
  * we don't want to send events for .git or
  * other event triggers such as extension.js.map events
  */
  private isValidatedFile(textDocument: TextDocument, fileName: string, isCloseEvent = false) {
    if (!fileName) {
      return false;
    }

    const scheme = textDocument.uri.scheme;

    // we'll get "git" as a scheme, but these are the schemes that match to open files in the editor
    const isDocEventScheme = scheme === 'file' || scheme === 'untitled' || scheme === 'vscode-remote';
    const isLiveShareTmpFile = fileName.match(/.*\.code-workspace.*vsliveshare.*tmp-.*/);
    const isInternalFile = fileName.match(
      /.*\.iceworks.*/,
    );

    // return false that its not a doc that we want to track based on the
    // following conditions:
    // non-doc scheme, is liveShare tmp file, is internal file and the file is no longer active
    if (
      !isDocEventScheme ||
      isLiveShareTmpFile ||
      isInternalFile ||
      (!isFileActive(fileName) && !isCloseEvent)
    ) {
      return false;
    }

    return true;
  }

  private getFileInfo(textDocument: TextDocument, fileName: string): FileInfo {
    if (fileInfoCache[fileName]) {
      return fileInfoCache[fileName];
    }

    const languageId = textDocument.languageId || textDocument.fileName.split('.').slice(-1)[0];
    const length = textDocument.getText().length;
    const lineCount = textDocument.lineCount || 0;
    fileInfoCache[fileName] = {
      fileName,
      languageId,
      length,
      lineCount,
    };

    return fileInfoCache[fileName];
  }

  private keystrokeTriggerTimeout: NodeJS.Timeout;

  private sendKeystrokeStats() {
  }

  private async createKeystrokeStats(fileName: string, projectPath: string): Promise<KeystrokeStats> {
    const { nowInSec } = getNowTimes();
    let keystrokeStats = keystrokeStatsMap[projectPath];
    if (!keystrokeStats) {
      const project = new Project();
      keystrokeStats = new KeystrokeStats(project);
      keystrokeStats.start = nowInSec;

      // start the minute timer to send the data
      this.keystrokeTriggerTimeout = setTimeout(() => {
        this.sendKeystrokeStats();
      }, DEFAULT_DURATION_MILLISECONDS);
    }

    // check if we have this file or not
    const hasFile = keystrokeStats.files[fileName];
    if (!hasFile) {
      const fileChangeSummary = new FileChangeSummary();
      fileChangeSummary.start = nowInSec;
      keystrokeStats.files[fileName] = fileChangeSummary;
    }
    // else if (parseInt(keystrokeStats.source[fileName].end, 10) !== 0) {
    //   // re-initialize it since we ended it before the minute was up
    //   keystrokeStats.source[fileName].end = 0;
    //   keystrokeStats.source[fileName].local_end = 0;
    // }

    keystrokeStatsMap[projectPath] = keystrokeStats;
    return keystrokeStats;
  }

  private endPreviousModifiedFiles(keystrokeStats: KeystrokeStats, fileName: string) {
    if (keystrokeStats) {
      const fileKeys = Object.keys(keystrokeStats.files);
      const nowTimes = getNowTimes();
      if (fileKeys.length) {
        // set the end time to now for the other files that don't match this file
        fileKeys.forEach((key) => {
          const fileChangeSummary: FileChangeSummary = keystrokeStats.files[key];
          if (key !== fileName && fileChangeSummary.end === 0) {
            fileChangeSummary.end = nowTimes.nowInSec;
          }
        });
      }
    }
  }

  private updateStaticValues(keyStrokeStats: KeystrokeStats, fileInfo: FileInfo) {
    console.log(keyStrokeStats, fileInfo);
  }

  private async onDidOpenTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName } = textDocument;
    if (!this.isValidatedFile(textDocument, fileName)) {
      return;
    }

    const fileInfo = this.getFileInfo(textDocument, fileName);
    const projectPath = getProjectPathForFile(fileName) || NO_PROJ_NAME;

    const keyStrokeStats = await this.createKeystrokeStats(fileName, projectPath);
    this.endPreviousModifiedFiles(keyStrokeStats, fileName);
    this.updateStaticValues(keyStrokeStats, fileInfo);
  }

  private async onDidCloseTextDocument(textDocument: TextDocument) {
    console.log(textDocument);
  }

  private async onDidChangeTextDocument(textDocumentChangeEvent: TextDocumentChangeEvent) {
    console.log(textDocumentChangeEvent);
  }

  private async onDidChangeWindowState(windowState: WindowState) {
    console.log(windowState);
  }
}

let instance: KpmManager;

export function getInstance(): KpmManager {
  if (!instance) {
    createInstance();
  }

  return instance;
}

export function createInstance() {
  instance = new KpmManager();
}