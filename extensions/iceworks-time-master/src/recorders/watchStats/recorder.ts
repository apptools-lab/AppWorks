import { TextDocument, TextEditor, window, WindowState } from 'vscode';
import logger from '../../utils/logger';
import { Project } from '../../storages/project';
import { cleanTextInfoCache } from '../../storages/file';
import { WatchStats } from './watchStats';
import { NODE_ACTIVE_TEXT_EDITOR_NAME } from '../../constants';

const watchStatsMap: {[projectPath: string]: WatchStats} = {};

export class WatchStatsRecorder {
  private currentWatchFilePath: string;

  async activate() {
    logger.debug('[WatchStatsRecorder][activate][focused]', window.state.focused);

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);

    if (window.state.focused) {
      await this.startRecord();
    }
  }

  async deactivate() {
    // placeholder
  }

  async sendData() {
    const watchStatsMapKeys = Object.keys(watchStatsMap);
    logger.debug('[WatchStatsRecorder][endRecord][watchStatsMapKeys]', watchStatsMapKeys);

    await this.destroyCurrentWatchFile();
    for (const projectPath in watchStatsMap) {
      if (Object.prototype.hasOwnProperty.call(watchStatsMap, projectPath)) {
        const watchStats = watchStatsMap[projectPath];
        await watchStats.sendData();
        delete watchStatsMap[projectPath];
      }
    }

    cleanTextInfoCache();
  }

  private async createCurrentWatchFile(fsPath: string, document: TextDocument) {
    this.currentWatchFilePath = fsPath;
    const watchStats = await this.createWatchStats(fsPath);
    const currentWatchFile = watchStats.files[fsPath];
    currentWatchFile.setStart();
    currentWatchFile.updateTextInfo(document);
  }

  private async destroyCurrentWatchFile() {
    const cwFilePath = this.currentWatchFilePath;
    if (cwFilePath) {
      const currentWatchStats = await this.createWatchStats(cwFilePath);
      currentWatchStats.files[cwFilePath].setEnd();
      this.currentWatchFilePath = undefined;
    }
  }

  private async startRecord() {
    const { activeTextEditor } = window;
    const fsPath = activeTextEditor?.document.fileName || NODE_ACTIVE_TEXT_EDITOR_NAME;

    logger.debug('[WatchStatsRecorder][startRecord][fsPath]', fsPath);

    await this.createCurrentWatchFile(fsPath, activeTextEditor?.document);
  }

  private async endRecord() {
    await this.sendData();
  }

  private async onDidChangeWindowState(windowState: WindowState) {
    logger.debug('[WatchStatsRecorder][onDidChangeWindowState][focused]', windowState.focused);

    if (!windowState.focused) {
      await this.endRecord();
    } else {
      await this.startRecord();
    }
  }

  private async onDidChangeActiveTextEditor(textEditor: TextEditor) {
    const fsPath = textEditor?.document.fileName || NODE_ACTIVE_TEXT_EDITOR_NAME;
    const cwFilePath = this.currentWatchFilePath;

    logger.debug('[WatchStatsRecorder][onDidChangeActiveTextEditor][fsPath]', fsPath);
    logger.debug('[WatchStatsRecorder][onDidChangeActiveTextEditor][currentWatchFilePath]', cwFilePath);

    if (fsPath !== cwFilePath) {
      await this.destroyCurrentWatchFile();
      await this.createCurrentWatchFile(fsPath, textEditor?.document);
    }
  }

  private async createWatchStats(fsPath: string): Promise<WatchStats> {
    const project = await Project.createInstance(fsPath);
    const { directory: projectPath } = project;
    let watchStats = watchStatsMap[projectPath];

    if (!watchStats) {
      watchStats = new WatchStats(project);
      watchStats.activate();
    }

    const hasFile = !!watchStats.getFile(fsPath);
    if (!hasFile) {
      watchStats.addFile(fsPath);
    }

    watchStatsMap[projectPath] = watchStats;
    return watchStats;
  }
}

let wathStatsRecorder: WatchStatsRecorder;
export function getInterface() {
  if (!wathStatsRecorder) {
    wathStatsRecorder = new WatchStatsRecorder();
  }
  return wathStatsRecorder;
}
