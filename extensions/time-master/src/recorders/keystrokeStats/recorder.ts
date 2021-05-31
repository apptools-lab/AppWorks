import { TextDocument, TextDocumentChangeEvent, WindowState, window, TextDocumentContentChangeEvent, workspace } from 'vscode';
import { checkIsO2 } from '@appworks/common-service';
import { isFileActive } from '../../utils/common';
import { Project } from '../../storages/project';
import { cleanTextInfoCache } from '../../storages/file';
import { KeystrokeStats } from './keystrokeStats';
import logger from '../../utils/logger';
import { recordKeystrokeDurationMins } from '../../config';

const keystrokeStatsMap: {[projectPath: string]: KeystrokeStats} = {};

export class KeystrokeStatsRecorder {
  private keystrokeStatsTimeouts: {[key: string]: NodeJS.Timeout} = {};

  public async activate() {
    // document listener handlers
    workspace.onDidOpenTextDocument(this.onDidOpenTextDocument, this);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this);
    // window state changed handler
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  public async deactivate() {
    await this.processData();
  }

  /**
   * send logic:
   *
   * - Change Window State, not focused
   * - The time interval between keystrokes, control by "recordKeystrokeDurationMins"
   * - extension deactivate
   */
  private async processData() {
    for (const projectPath in keystrokeStatsMap) {
      if (Object.prototype.hasOwnProperty.call(keystrokeStatsMap, projectPath)) {
        // clear other sending instructions and prevent multiple sending
        if (this.keystrokeStatsTimeouts[projectPath]) {
          clearTimeout(this.keystrokeStatsTimeouts[projectPath]);
        }
        await this.processKeystrokeStats(projectPath);
      }
    }

    cleanTextInfoCache();
  }

  public async onDidOpenTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName: fsPath } = textDocument;
    if (!this.isValidatedFile(textDocument, fsPath)) {
      return;
    }

    const keyStrokeStats = await this.createKeystrokeStats(fsPath);
    const currentFileChange = keyStrokeStats.files[fsPath];
    currentFileChange.updateTextInfo(textDocument);
    currentFileChange.open += 1;
  }

  public async onDidCloseTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName: fsPath } = textDocument;
    if (!this.isValidatedFile(textDocument, fsPath, true)) {
      return;
    }

    const keyStrokeStats = await this.createKeystrokeStats(fsPath);
    const currentFileChange = keyStrokeStats.files[fsPath];
    currentFileChange.close += 1;
  }

  public async onDidChangeTextDocument(textDocumentChangeEvent: TextDocumentChangeEvent) {
    // TODO remove it, just avoid bug on O2
    if (checkIsO2() && textDocumentChangeEvent.document.uri.scheme !== 'file') {
      return;
    }
    const windowIsFocused = window.state.focused;
    logger.debug('[KeystrokeStatsRecorder][onDidChangeTextDocument][windowIsFocused]', windowIsFocused);
    if (!windowIsFocused) {
      return;
    }

    const { document } = textDocumentChangeEvent;
    const { fileName: fsPath } = document;

    const isValidatedFile = this.isValidatedFile(document, fsPath);
    logger.debug('[KeystrokeStatsRecorder][onDidChangeTextDocument][isValidatedFile]', isValidatedFile);
    if (!isValidatedFile) {
      return;
    }

    const keyStrokeStats = await this.createKeystrokeStats(fsPath);
    const currentFileChange = keyStrokeStats.files[fsPath];
    if (!currentFileChange.start) {
      currentFileChange.setStart();
    }
    currentFileChange.updateTextInfo(document);

    // find the contentChange with a range in the contentChanges array
    // THIS CAN HAVE MULTIPLE CONTENT_CHANGES WITH RANGES AT ONE TIME.
    // LOOP THROUGH AND REPEAT COUNTS
    const contentChanges = textDocumentChangeEvent.contentChanges.filter((change) => change.range);
    const contentChangesLength = contentChanges.length;
    logger.debug('[KeystrokeStatsRecorder][onDidChangeTextDocument]contentChanges', contentChangesLength);
    // each changeset is triggered by a single keystroke
    if (contentChangesLength > 0) {
      currentFileChange.keystrokes += 1;
    }

    for (const contentChange of contentChanges) {
      const textChangeInfo = this.getTextChangeInfo(contentChange);
      if (textChangeInfo.textChangeLen > 4) { // 4 is the threshold here due to typical tab size of 4 spaces
        currentFileChange.pasteTimes += 1;
      } else if (textChangeInfo.textChangeLen < 0) {
        currentFileChange.deleteTimes += 1;
      } else if (textChangeInfo.hasNonNewLine) {
        currentFileChange.addTimes += 1;
      }
      // increment keystrokes by 1
      keyStrokeStats.keystrokes += 1;

      if (textChangeInfo.linesDeleted) {
        currentFileChange.linesRemoved += textChangeInfo.linesDeleted;
      } else if (textChangeInfo.linesAdded) {
        currentFileChange.linesAdded += textChangeInfo.linesAdded;
      }
    }

    currentFileChange.setEnd();
  }

  public async onDidChangeWindowState(windowState: WindowState) {
    const { focused } = windowState;
    logger.debug('[KeystrokeStatsRecorder][onDidChangeWindowState][focused]', focused);
    if (!focused) {
      await this.processData();
    }
  }

  /**
  * This will return true if it's a validated file.
  * we don't want to send events for .git or
  * other event triggers such as extension.js.map events
  */
  private isValidatedFile(textDocument: TextDocument, fsPath: string, isCloseEvent?: boolean) {
    if (!fsPath) {
      return false;
    }

    const { scheme } = textDocument.uri;

    // we'll get 'git' as a scheme, but these are the schemes that match to open files in the editor
    const isDocEventScheme = scheme === 'file' || scheme === 'untitled' || scheme === 'vscode-remote';
    const isLiveShareTmpFile = fsPath.match(/.*\.code-workspace.*vsliveshare.*tmp-.*/);
    const isInternalFile = fsPath.match(
      /.*\.appworks.*/,
    );

    // return false that its not a doc that we want to track based on the
    // following conditions:
    // non-doc scheme, is liveShare tmp file, is internal file and the file is no longer active
    if (
      !isDocEventScheme ||
      isLiveShareTmpFile ||
      isInternalFile ||
      (!isFileActive(fsPath) && !isCloseEvent)
    ) {
      return false;
    }

    return true;
  }

  private getTextChangeInfo(contentChange: TextDocumentContentChangeEvent) {
    const { rangeLength, text, range } = contentChange;

    let textChangeLen = text?.length;
    const linesChanged = range.end.line - range.start.line;
    const newLineMatches = text?.match(/[\n\r]/g);

    let linesAdded = 0;
    let linesDeleted = 0;
    let isCharDelete = false;
    if (linesChanged) {
      // update removed lines
      linesDeleted = linesChanged;
    } else if (newLineMatches && textChangeLen) {
      // this means there are new lines added
      linesAdded = newLineMatches.length;
    } else if (rangeLength && !text) {
      // this may be a character delete
      isCharDelete = true;
    }

    // check if its a character deletion
    if (!textChangeLen && rangeLength) {
      // NO content text but has a range change length, set the textChangeLen
      // to the inverse of the rangeLength to show the chars deleted
      textChangeLen = rangeLength / -1;
    }

    let hasNonNewLine = false;
    if (textChangeLen && !linesAdded && !linesDeleted) {
      // flag to state we have chars deleted but no new lines
      hasNonNewLine = true;
    }

    let hasChanges = false;
    if (linesAdded || linesDeleted || textChangeLen || isCharDelete) {
      // there are changes
      hasChanges = true;
    }

    return {
      linesAdded,
      linesDeleted,
      textChangeLen,
      isCharDelete,
      hasNonNewLine,
      hasChanges,
    };
  }

  private async processKeystrokeStats(projectPath: string) {
    const keystrokeStats = keystrokeStatsMap[projectPath];
    if (keystrokeStats) {
      await keystrokeStats.processData();
      delete keystrokeStatsMap[projectPath];
    }
  }

  private async createKeystrokeStats(fsPath: string): Promise<KeystrokeStats> {
    const project = await Project.createInstance(fsPath);
    const { directory: projectPath } = project;
    let keystrokeStats = keystrokeStatsMap[projectPath];

    if (!keystrokeStats) {
      keystrokeStats = new KeystrokeStats(project);
      keystrokeStats.activate();
      this.keystrokeStatsTimeouts[projectPath] = setTimeout(() => {
        logger.debug('[KeystrokeStatsRecorder][createKeystrokeStats][keystrokeStatsTimeouts] run');
        this.processKeystrokeStats(projectPath).catch(() => { /* ignore error */ });
      }, recordKeystrokeDurationMins);
    }

    if (!keystrokeStats.hasFile(fsPath)) {
      keystrokeStats.addFile(fsPath);
    }

    keystrokeStatsMap[projectPath] = keystrokeStats;
    return keystrokeStats;
  }
}

let keystrokeStatsRecorder: KeystrokeStatsRecorder;
export function getInterface() {
  if (!keystrokeStatsRecorder) {
    keystrokeStatsRecorder = new KeystrokeStatsRecorder();
  }
  return keystrokeStatsRecorder;
}
