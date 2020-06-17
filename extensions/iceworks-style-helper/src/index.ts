import * as vscode from 'vscode';
import inlineStyleAutoComplete from './inlineStyleAutoComplete';

function activate(context: vscode.ExtensionContext) {
  inlineStyleAutoComplete(context);
};

exports.activate = activate;