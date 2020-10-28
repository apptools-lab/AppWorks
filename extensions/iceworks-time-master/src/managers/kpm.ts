import { TextDocument, TextDocumentChangeEvent, WindowState, window, TextDocumentContentChangeEvent, workspace, commands } from 'vscode';
import { getNowTimes, isFileActive } from '../utils/common';
import { Project } from '../storages/project';
import { DEFAULT_DURATION_MILLISECONDS } from '../constants';
import { KeystrokeStats } from '../keystrokeStats';
import { cleanTextInfoCache } from '../storages/filesChange';
import { processPayload } from '../managers/data';

let keystrokeStatsMap: {[projectPath: string]: KeystrokeStats} = {};

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

    // we'll get 'git' as a scheme, but these are the schemes that match to open files in the editor
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

  constructor() {
    // document listener handlers
    workspace.onDidOpenTextDocument(this.onDidOpenTextDocument, this);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this);
    // window state changed handler
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  private sendKeystrokeStats() {
    //
    // Go through all keystroke count objects found in the map and send
    // the ones that have data (data is greater than 1), then clear the map
    //
    if (Object.keys(keystrokeStatsMap).length) {
      const keys = Object.keys(keystrokeStatsMap);
      // use a normal for loop since we have an await within the loop
      for (const key of keys) {
        const keystrokeStats = keystrokeStatsMap[key];

        // check if we have keystroke data
        if (keystrokeStats.hasData()) {
          // post the payload offline until the batch interval sends it out
          processPayload(keystrokeStats);
        }
      }
    }

    // clear out the keystroke map
    keystrokeStatsMap = {};

    // clear out the static info map
    cleanTextInfoCache();
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
    // else if (keystrokeStats.getFile(fileName).getEnd() !== 0) {
    //   // re-initialize it since we ended it before the minute was up
    //   keystrokeStats.getFile(fileName).setEnd(0);
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
    // this.endPreviousModifiedFiles(keyStrokeStats, fileName);

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
    console.log('TODO');
  }

  private analyzeDocumentChange(contentChange: TextDocumentContentChangeEvent) {
    const linesAdded = contentChange.text?.match(/[\n\r]/g)?.length || 0;
    const linesDeleted = contentChange.range.end.line - contentChange.range.start.line;
    let charactersAdded = contentChange.text.length - linesAdded;
    const charactersDeleted = contentChange.rangeLength - linesDeleted;
    let changeType = '';

    if (charactersDeleted > 0 || linesDeleted > 0) {
      if (charactersAdded > 0) {
        changeType = 'replacement';
      } else if (charactersDeleted > 1 || linesDeleted > 1) {
        changeType = 'multiDelete';
      } else if (charactersDeleted == 1 || linesDeleted == 1) {
        changeType = 'singleDelete';
      }
    } else if (charactersAdded > 1 || linesAdded > 1) {
      if (contentChange.text.match(/^[\n\r]\s*$/)?.length == 1) {
        // the regex matches a text that is a newline followed by only whitespace
        charactersAdded = 0;
        changeType = 'singleDelete';
      } else {
        changeType = 'multiAdd';
      }
    } else if (charactersAdded == 1 || linesAdded == 1) {
      changeType = 'singleAdd';
    }

    return {
      linesAdded,
      linesDeleted,
      charactersAdded,
      charactersDeleted,
      changeType,
    };
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

  private async onDidChangeTextDocument(textDocumentChangeEvent: TextDocumentChangeEvent) {
    // console.log(textDocumentChangeEvent);
    if (!window.state.focused) {
      return;
    }

    const { document } = textDocumentChangeEvent;
    const { fileName } = document;

    if (!this.isValidatedFile(document, fileName)) {
      return;
    }

    const projectInfo = await (new Project(fileName)).ready();
    const keyStrokeStats = await this.createKeystrokeStats(fileName, projectInfo);

    const currentFileChangeSummary = keyStrokeStats.getFile(fileName);
    currentFileChangeSummary.updateTextInfo(document);

    // find the contentChange with a range in the contentChanges array
    // THIS CAN HAVE MULTIPLE CONTENT_CHANGES WITH RANGES AT ONE TIME.
    // LOOP THROUGH AND REPEAT COUNTS
    const contentChanges = textDocumentChangeEvent.contentChanges.filter((change) => change.range);
    // each changeset is triggered by a single keystroke
    if (contentChanges.length > 0) {
      currentFileChangeSummary.keystrokes += 1;
    }

    for (const contentChange of contentChanges) {
      const textChangeInfo = this.getTextChangeInfo(contentChange);
      if (textChangeInfo.textChangeLen > 4) {
        // 4 is the threshold here due to typical tab size of 4 spaces
        // it's a copy and paste event
        currentFileChangeSummary.paste += 1;
        currentFileChangeSummary.charsPasted += textChangeInfo.textChangeLen;
        console.log('Copy+Paste Incremented');
      } else if (textChangeInfo.textChangeLen < 0) {
        currentFileChangeSummary.delete += 1;
        // update the overall count
      } else if (textChangeInfo.hasNonNewLine) {
        // update the data for this fileInfo keys count
        currentFileChangeSummary.add += 1;
        // update the overall count
        console.log('charsAdded incremented');
        console.log('addEvents incremented');
      }
      // increment keystrokes by 1
      keyStrokeStats.keystrokes += 1;

      if (textChangeInfo.linesDeleted) {
        console.log(`Removed ${textChangeInfo.linesDeleted} lines`);
        currentFileChangeSummary.linesRemoved += textChangeInfo.linesDeleted;
      } else if (textChangeInfo.linesAdded) {
        console.log(`Added ${textChangeInfo.linesAdded} lines`);
        currentFileChangeSummary.linesAdded += textChangeInfo.linesAdded;
      }
    }

    const { nowInSec } = getNowTimes();
    currentFileChangeSummary.setEnd(nowInSec);
  }

  private async onDidChangeWindowState(windowState: WindowState) {
    if (!windowState.focused) {
      commands.executeCommand('iceworks.processKeystrokeData');
    }
  }

  public processKeystrokeData() {
    if (this.keystrokeTriggerTimeout) {
      clearTimeout(this.keystrokeTriggerTimeout);
    }
    this.sendKeystrokeStats();
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