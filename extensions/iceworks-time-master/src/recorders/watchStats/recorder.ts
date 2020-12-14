import { TextEditor, window, WindowState } from 'vscode';
import logger from '../../utils/logger';
import { Project } from '../../storages/project';
import { cleanTextInfoCache } from '../../storages/file';
import { WatchStats } from './watchStats';
import { NODE_ACTIVE_TEXT_EDITOR_NAME } from '../../constants';

const watchStatsMap: {[projectPath: string]: WatchStats} = {};

export class WatchStatsRecorder {
  private currentFsPath: string;

  async activate() {
    logger.debug('[WatchStatsRecorder][activate][focused]', window.state.focused);

    if (window.state.focused) {
      this.startRecord();
    }

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  async deactivate() {
    // placeholder
  }

  async sendData() {
    const watchStatsMapKeys = Object.keys(watchStatsMap);
    logger.debug('[WatchStatsRecorder][endRecord][watchStatsMapKeys]', watchStatsMapKeys);

    await Promise.all(watchStatsMapKeys.map(async (projectPath) => {
      const watchStats = watchStatsMap[projectPath];

      // end current watch
      watchStats.files[this.currentFsPath]?.setEnd();
      this.currentFsPath = undefined;

      await watchStats.sendData();
      delete watchStatsMap[projectPath];
    }));

    cleanTextInfoCache();
  }

  private async startRecord() {
    const { activeTextEditor } = window;
    const fsPath = activeTextEditor?.document.fileName || NODE_ACTIVE_TEXT_EDITOR_NAME;

    logger.debug('[WatchStatsRecorder][startRecord][fsPath]', fsPath);

    this.currentFsPath = fsPath;

    // start watch
    const watchStats = await this.createWatchStats(fsPath);
    const currentWatchFile = watchStats.files[fsPath];
    currentWatchFile.setStart();
    currentWatchFile.updateTextInfo(activeTextEditor?.document);
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

    logger.debug('[WatchStatsRecorder][onDidChangeActiveTextEditor][fsPath]', fsPath);
    logger.debug('[WatchStatsRecorder][onDidChangeActiveTextEditor][currentFsPath]', this.currentFsPath);

    if (fsPath !== this.currentFsPath) {
      // end current watch
      const currentWatchStats = await this.createWatchStats(this.currentFsPath);
      currentWatchStats.files[this.currentFsPath].setEnd();

      // stat new watch
      this.currentFsPath = fsPath;
      const newWatchStats = await this.createWatchStats(fsPath);
      const newWatchFile = newWatchStats.files[fsPath];
      newWatchFile.setStart();
      newWatchFile.updateTextInfo(textEditor?.document);
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

    if (!watchStats.getFile(fsPath)) {
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
