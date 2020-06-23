import * as vscode from 'vscode';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';
import styleInfoViewer from './styleInfoViewer';


function activate(context: vscode.ExtensionContext) {
  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
  styleInfoViewer(context);
};

exports.activate = activate;