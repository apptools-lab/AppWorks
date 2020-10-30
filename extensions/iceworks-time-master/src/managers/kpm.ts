import { TextDocument, TextDocumentChangeEvent, WindowState, window, TextDocumentContentChangeEvent, workspace } from 'vscode';
import { isFileActive, logIt } from '../utils/common';
import { DEFAULT_DURATION_MILLISECONDS } from '../constants';
import { Project } from '../storages/project';
import { KeystrokeStats } from '../keystrokeStats';
import { cleanTextInfoCache } from '../storages/filesChange';

const keystrokeStatsMap: {[projectPath: string]: KeystrokeStats} = {};

export class KpmManager {
  /**
  * This will return true if it's a validated file.
  * we don't want to send events for .git or
  * other event triggers such as extension.js.map events
  */
  private isValidatedFile(textDocument: TextDocument, fsPath: string, isCloseEvent?: boolean) {
    if (!fsPath) {
      return false;
    }

    const scheme = textDocument.uri.scheme;

    // we'll get 'git' as a scheme, but these are the schemes that match to open files in the editor
    const isDocEventScheme = scheme === 'file' || scheme === 'untitled' || scheme === 'vscode-remote';
    const isLiveShareTmpFile = fsPath.match(/.*\.code-workspace.*vsliveshare.*tmp-.*/);
    const isInternalFile = fsPath.match(
      /.*\.iceworks.*/,
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

  public activate() {
    // document listener handlers
    workspace.onDidOpenTextDocument(this.onDidOpenTextDocument, this);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this);
    // window state changed handler
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  public deactivate() {
    // TODO
  }

  public sendKeystrokeStatsMap() {
    for (const projectPath in keystrokeStatsMap) {
      if (this.keystrokeStatsTimeouts[projectPath]) {
        clearTimeout(this.keystrokeStatsTimeouts[projectPath]);
      }
      this.sendKeystrokeStats(projectPath);
    }

    // clear out the static info map
    cleanTextInfoCache();
  }

  private sendKeystrokeStats(projectPath: string) {
    const keystrokeStats = keystrokeStatsMap[projectPath];
    if (keystrokeStats) {
      keystrokeStats.sendData();
      delete keystrokeStatsMap[projectPath];
    }
  }

  private keystrokeStatsTimeouts: {[key: string]: NodeJS.Timeout} = {};

  private async createKeystrokeStats(fsPath: string, project: Project): Promise<KeystrokeStats> {
    const { directory: projectPath } = project;
    let keystrokeStats = keystrokeStatsMap[projectPath];

    // create the keystroke count if it doesn't exist
    if (!keystrokeStats) {
      keystrokeStats = new KeystrokeStats(project);
      keystrokeStats.activate();
      this.keystrokeStatsTimeouts[projectPath] = setTimeout(() => {
        logIt('[KpmManager][createKeystrokeStats][keystrokeStatsTimeouts] run');
        this.sendKeystrokeStats(projectPath);
      }, DEFAULT_DURATION_MILLISECONDS);
    }

    if (!keystrokeStats.hasFile(fsPath)) {
      keystrokeStats.addFile(fsPath);
    }

    keystrokeStatsMap[projectPath] = keystrokeStats;
    return keystrokeStats;
  }

  public async onDidOpenTextDocument(textDocument: TextDocument) {
    if (!window.state.focused) {
      return;
    }

    const { fileName: fsPath } = textDocument;
    if (!this.isValidatedFile(textDocument, fsPath)) {
      return;
    }

    const projectInfo = await Project.createInstance(fsPath);

    const keyStrokeStats = await this.createKeystrokeStats(fsPath, projectInfo);
    // this.endPreviousModifiedFiles(keyStrokeStats, fsPath);

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

    const projectInfo = await Project.createInstance(fsPath);
    const keyStrokeStats = keystrokeStatsMap[projectInfo.directory];
    if (keyStrokeStats) {
      const currentFileChange = keyStrokeStats.files[fsPath];
      if (currentFileChange) {
        currentFileChange.close += 1;
      }
    }
  }

  public async onDidChangeTextDocument(textDocumentChangeEvent: TextDocumentChangeEvent) {
    const windowIsFocused = window.state.focused;
    logIt('[KpmManager][onDidChangeTextDocument][windowIsFocused]', windowIsFocused);
    if (!windowIsFocused) {
      return;
    }

    const { document } = textDocumentChangeEvent;
    const { fileName: fsPath } = document;

    const isValidatedFile = this.isValidatedFile(document, fsPath);
    logIt('[KpmManager][onDidChangeTextDocument][isValidatedFile]', isValidatedFile);
    if (!isValidatedFile) {
      return;
    }

    const projectInfo = await Project.createInstance(fsPath);
    const keyStrokeStats = await this.createKeystrokeStats(fsPath, projectInfo);

    const currentFileChange = keyStrokeStats.files[fsPath];
    if (!currentFileChange.start) {
      currentFileChange.setStart();
    }
    currentFileChange.updateTextInfo(document);

    // find the contentChange with a range in the contentChanges array
    // THIS CAN HAVE MULTIPLE CONTENT_CHANGES WITH RANGES AT ONE TIME.
    // LOOP THROUGH AND REPEAT COUNTS
    const contentChanges = textDocumentChangeEvent.contentChanges.filter((change) => change.range);
    logIt('[KpmManager][onDidChangeTextDocument]contentChanges', contentChanges);
    // each changeset is triggered by a single keystroke
    if (contentChanges.length > 0) {
      currentFileChange.keystrokes += 1;
    }

    for (const contentChange of contentChanges) {
      const textChangeInfo = this.getTextChangeInfo(contentChange);
      if (textChangeInfo.textChangeLen > 4) {
        // 4 is the threshold here due to typical tab size of 4 spaces
        // it's a copy and paste event
        currentFileChange.paste += 1;
        currentFileChange.charsPasted += textChangeInfo.textChangeLen;
        logIt('[KpmManager][onDidChangeTextDocument]Copy+Paste Incremented');
      } else if (textChangeInfo.textChangeLen < 0) {
        currentFileChange.delete += 1;
        // update the overall count
      } else if (textChangeInfo.hasNonNewLine) {
        // update the data for this fileInfo keys count
        currentFileChange.add += 1;
        // update the overall count
        logIt('[KpmManager][onDidChangeTextDocument]add incremented');
      }
      // increment keystrokes by 1
      keyStrokeStats.keystrokes += 1;

      if (textChangeInfo.linesDeleted) {
        logIt(`[KpmManager][onDidChangeTextDocument]Removed ${textChangeInfo.linesDeleted} lines`);
        currentFileChange.linesRemoved += textChangeInfo.linesDeleted;
      } else if (textChangeInfo.linesAdded) {
        logIt(`[KpmManager][onDidChangeTextDocument]Added ${textChangeInfo.linesAdded} lines`);
        currentFileChange.linesAdded += textChangeInfo.linesAdded;
      }
    }

    currentFileChange.setEnd();
  }

  public async onDidChangeWindowState(windowState: WindowState) {
    logIt('[KpmManager][onDidChangeWindowState][focused]', windowState.focused);
    if (!windowState.focused) {
      this.sendKeystrokeStatsMap();
    }
  }
}

let instance: KpmManager;

export function getInstance(): KpmManager {
  return instance || createInstance();
}

export function createInstance() {
  instance = new KpmManager();
  return instance;
}