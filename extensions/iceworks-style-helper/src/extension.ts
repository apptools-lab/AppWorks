import * as vscode from 'vscode';
import { Recorder, recordCompletionItemSelect } from '@iceworks/recorder';
import { registerCommand, initExtension } from '@iceworks/common-service';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';
import styleInfoViewer from './styleInfoViewer';
import sassVariablesViewer from './sassVariablesViewer';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "iceworks-style-helper" is now active!');
  recorder.recordActivate();

  // auto set configuration
  initExtension(context, name);

  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
  styleInfoViewer(context);
  sassVariablesViewer(context);

  registerCommand('iceworksApp.recorder.recordCompletionItemSelect', () => {
    recordCompletionItemSelect();
  });
}

export function deactivate() { }
