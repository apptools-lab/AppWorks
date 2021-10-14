import * as vscode from 'vscode';
import { Recorder, recordCompletionItemSelect } from '@appworks/recorder';
import { registerCommand, initExtension } from '@appworks/common-service';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';
import jsxVarStylesComplete from './jsxVarStylesComplete';
import styleInfoViewer from './styleInfoViewer';
import sassVariablesViewer from './sassVariablesViewer';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "style-helper" is now active!');
  recorder.recordActivate();

  // auto set configuration
  initExtension(context);

  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
  jsxVarStylesComplete(context);
  styleInfoViewer(context);
  sassVariablesViewer(context);

  registerCommand('style-helper.recordCompletionItemSelect', () => {
    recordCompletionItemSelect();
  });
}

export function deactivate() { }
