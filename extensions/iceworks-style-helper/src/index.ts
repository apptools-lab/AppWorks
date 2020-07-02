import * as vscode from 'vscode';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';
import styleInfoViewer from './styleInfoViewer';
import sassVariablesViewer from './sassVariablesViewer';

function activate(context: vscode.ExtensionContext) {
  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
  styleInfoViewer(context);
  sassVariablesViewer(context);
};

exports.activate = activate;