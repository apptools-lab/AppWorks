import * as vscode from 'vscode';
import propsAutoComplete from './propsAutoComplete';

function activate() {
  propsAutoComplete();
};

exports.activate = activate;
