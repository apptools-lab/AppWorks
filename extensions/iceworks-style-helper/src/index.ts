import * as vscode from 'vscode';
import { Recorder } from '@iceworks/recorder';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';
import styleInfoViewer from './styleInfoViewer';
import sassVariablesViewer from './sassVariablesViewer';

// eslint-disable-next-line
const { name, version } = require('../package.json');
const recorder = new Recorder(name, version);

function activate(context: vscode.ExtensionContext) {
  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
  styleInfoViewer(context);
  sassVariablesViewer(context);

  recorder.recordActivate();
}

exports.activate = activate;
