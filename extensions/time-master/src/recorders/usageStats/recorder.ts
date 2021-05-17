import { TextDocument, TextEditor, window, WindowState } from 'vscode';
import logger from '../../utils/logger';
import { Project } from '../../storages/project';
import { cleanTextInfoCache } from '../../storages/file';
import { UsageStats } from './usageStats';
import { NODE_ACTIVE_TEXT_EDITOR_NAME } from '../../constants';
import { processUsageStatsDurationMins } from '../../config';

const usageStatsMap: {[projectPath: string]: UsageStats} = {};

export class UsageStatsRecorder {
  private currentUsageFilePath: string;

  private processUsageStatsTimmer: NodeJS.Timeout;

  async activate() {
    const { focused } = window.state;
    logger.debug('[UsageStatsRecorder][activate][focused]', focused);

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);

    if (focused) {
      await this.startRecord();
    }

    this.processUsageStatsTimmer = setInterval(() => {
      if (window.state.focused) {
        this.processData().catch((e) => {
          logger.error('[UsageStatsRecorder][activate][setInterval]got error:', e);
        });
      }
    }, processUsageStatsDurationMins);
  }

  async deactivate() {
    if (this.processUsageStatsTimmer) {
      clearInterval(this.processUsageStatsTimmer);
    }
    await this.processData();
  }

  /**
   * send logic:
   *
   * - Change Window State, not focused
   * - A certain time interval, control by "processUsageStatsDurationMins"
   * - extension deactivate
   */
  private async processData() {
    const usageStatsMapKeys = Object.keys(usageStatsMap);
    logger.debug('[UsageStatsRecorder][endRecord][usageStatsMapKeys]', usageStatsMapKeys);

    await this.destroyCurrentUsageFile();
    for (const projectPath in usageStatsMap) {
      if (Object.prototype.hasOwnProperty.call(usageStatsMap, projectPath)) {
        const usageStats = usageStatsMap[projectPath];
        await usageStats.processData();
        delete usageStatsMap[projectPath];
      }
    }

    cleanTextInfoCache();
  }

  private async createCurrentUsageFile(fsPath: string, document: TextDocument) {
    this.currentUsageFilePath = fsPath;
    const usageStats = await this.createUsageStats(fsPath);
    const currentUsageFile = usageStats.files[fsPath];
    currentUsageFile.setStart();
    currentUsageFile.updateTextInfo(document);
  }

  private async destroyCurrentUsageFile() {
    const cwFilePath = this.currentUsageFilePath;
    if (cwFilePath) {
      const currentUsageStats = await this.createUsageStats(cwFilePath);
      currentUsageStats.files[cwFilePath].setEnd();
      this.currentUsageFilePath = undefined;
    }
  }

  private async startRecord() {
    const { activeTextEditor } = window;
    const fsPath = activeTextEditor?.document.fileName || NODE_ACTIVE_TEXT_EDITOR_NAME;

    logger.debug('[UsageStatsRecorder][startRecord][fsPath]', fsPath);

    await this.createCurrentUsageFile(fsPath, activeTextEditor?.document);
  }

  private async endRecord() {
    await this.processData();
  }

  private async onDidChangeWindowState(windowState: WindowState) {
    const { focused } = windowState;
    logger.debug('[UsageStatsRecorder][onDidChangeWindowState][focused]', focused);

    if (!focused) {
      await this.endRecord();
    } else {
      await this.startRecord();
    }
  }

  private async onDidChangeActiveTextEditor(textEditor: TextEditor) {
    const fsPath = textEditor?.document.fileName || NODE_ACTIVE_TEXT_EDITOR_NAME;
    const cwFilePath = this.currentUsageFilePath;

    logger.debug('[UsageStatsRecorder][onDidChangeActiveTextEditor][fsPath]', fsPath);

    if (fsPath !== cwFilePath) {
      await this.destroyCurrentUsageFile();
      await this.createCurrentUsageFile(fsPath, textEditor?.document);
    }
  }

  private async createUsageStats(fsPath: string): Promise<UsageStats> {
    const project = await Project.createInstance(fsPath);
    const { directory: projectPath } = project;
    let usageStats = usageStatsMap[projectPath];

    if (!usageStats) {
      usageStats = new UsageStats(project);
      usageStats.activate();
    }

    const hasFile = !!usageStats.getFile(fsPath);
    if (!hasFile) {
      usageStats.addFile(fsPath);
    }

    usageStatsMap[projectPath] = usageStats;
    return usageStats;
  }
}

let usageStatsRecorder: UsageStatsRecorder;
export function getInterface() {
  if (!usageStatsRecorder) {
    usageStatsRecorder = new UsageStatsRecorder();
  }
  return usageStatsRecorder;
}
