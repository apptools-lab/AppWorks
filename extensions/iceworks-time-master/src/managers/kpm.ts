import { TextDocument, TextDocumentChangeEvent, WindowState, window } from 'vscode';
import { isFileActive } from '../utils/common';
import { Project } from '../storages/project';
import { DEFAULT_DURATION_MILLISECONDS } from '../constants';
import { KeystrokeStats } from '../keystrokeStats';

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

  private keystrokeTriggerTimeout: NodeJS.Timeout;

  private sendKeystrokeStats() {
  }

  private async createKeystrokeStats(fileName: string, project: Project): Promise<KeystrokeStats> {
    const { directory: projectPath } = project;
    let keystrokeStats = keystrokeStatsMap[projectPath];

    // create the keystroke count if it doesn't exist
    if (!keystrokeStats) {
      keystrokeStats = new KeystrokeStats(project);

      // start the minute timer to send the data
      this.keystrokeTriggerTimeout = setTimeout(() => {
        this.sendKeystrokeStats();
      }, DEFAULT_DURATION_MILLISECONDS);
    }

    // check if we have this file or not
    if (!keystrokeStats.hasFile(fileName)) { // no file, add a new file
      keystrokeStats.addFile(fileName);
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
    // set the end time to now for the other files that don't match this file
    keystrokeStats.setFilesEndAsNow([fileName]);
  }

  private async onDidOpenTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName } = textDocument;
    if (!this.isValidatedFile(textDocument, fileName)) {
      return;
    }

    const projectInfo = await (new Project(fileName)).ready();

    const keyStrokeStats = await this.createKeystrokeStats(fileName, projectInfo);
    this.endPreviousModifiedFiles(keyStrokeStats, fileName);

    const currentFileChangeSummary = keyStrokeStats.getFile(fileName);
    currentFileChangeSummary.updateTextInfo(textDocument);
    currentFileChangeSummary.open += 1;
  }

  private async onDidCloseTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName } = textDocument;
    if (!this.isValidatedFile(textDocument, fileName, true)) {
      return;
    }

    // TODO
    console.log('testing');
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