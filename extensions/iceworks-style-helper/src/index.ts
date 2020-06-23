import * as vscode from 'vscode';
import cssClassAutoCompete from './cssClassAutoCompete';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';


function activate(context: vscode.ExtensionContext) {
  cssClassAutoCompete(context);
  inlineStyleAutoComplete(context);
};

exports.activate = activate;