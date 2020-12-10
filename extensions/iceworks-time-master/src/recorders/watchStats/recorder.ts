import { TextEditor, window, WindowState } from 'vscode';
import logger from '../../utils/logger';

export class WatchStatsRecorder {
  activate() {
    if (window.state.focused) {
      this.startRecord();
    }

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this);
    window.onDidChangeWindowState(this.onDidChangeWindowState, this);
  }

  startRecord() {

  }

  onDidChangeWindowState(windowState: WindowState) {
    logger.debug('[EditorStatsRecorder][onDidChangeWindowState][focused]', windowState.focused);
  }

  onDidChangeActiveTextEditor(textEditor: TextEditor) {
    logger.debug('[EditorStatsRecorder][onDidChangeActiveTextEditor][textEditor]', textEditor);
  }
}
