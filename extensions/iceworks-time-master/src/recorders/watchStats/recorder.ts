import { TextEditor, window, WindowState } from 'vscode';
import logger from '../../utils/logger';
import { Project } from '../../storages/project';
import { cleanTextInfoCache } from '../../storages/file';
import { WatchStats } from './watchStats';

const watchStatsMap: {[projectPath: string]: WatchStats} = {};

export class WatchStatsRecorder {
  private currentFsPath: string;

  async activate() {
    logger.debug('[EditorStatsRecorder][activate][focused]', window.state.focused);

    if (window.state.focused) {
      this.startRecord();
    }

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  async deactivate() {
    // placeholder
  }

  async startRecord() {
    const { activeTextEditor } = window;
    const { document } = activeTextEditor;
    const fsPath = document?.fileName;

    this.currentFsPath = fsPath;
    const watchStats = await this.createWatchStats(fsPath);
    const currentWatchFile = watchStats.files[fsPath];
    // currentWatchFile.updateTextInfo(document);
    currentWatchFile.setStart();
  }

  async endRecord() {
    await Promise.all(Object.keys(watchStatsMap).map(async (projectPath) => {
      const watchStats = watchStatsMap[projectPath];
      if (watchStats) {
        watchStats.files[this.currentFsPath]?.setEnd();
        await watchStats.sendData();
        delete watchStats[projectPath];
        this.currentFsPath = undefined;
      }
    }));

    cleanTextInfoCache();
  }

  async onDidChangeWindowState(windowState: WindowState) {
    logger.debug('[EditorStatsRecorder][onDidChangeWindowState][focused]', windowState.focused);

    if (!windowState.focused) {
      await this.endRecord();
    } else {
      await this.startRecord();
    }
  }

  async onDidChangeActiveTextEditor(textEditor: TextEditor) {
    logger.debug('[EditorStatsRecorder][onDidChangeActiveTextEditor][textEditor]', textEditor);

    const { document } = textEditor;
    const fsPath = document?.fileName;
    if (fsPath !== this.currentFsPath) {
      const watchStats = await this.createWatchStats(this.currentFsPath);
      watchStats.files[this.currentFsPath].setEnd();

      let currentFile = watchStats.getFile(fsPath);
      if (!currentFile) {
        currentFile = watchStats.addFile(fsPath);
      }
      currentFile.setStart();
      this.currentFsPath = fsPath;
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
