import { ExtensionContext, commands } from 'vscode';
import { initExtension } from '@iceworks/common-service';
import { removeCompAndRef, removeCompSelectionAndRef } from './commands';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  commands.registerCommand('iceworks-refactor.component.dir-and-reference.remove', removeCompAndRef);
  commands.registerTextEditorCommand('iceworks-refactor.component.selection-and-reference.remove', removeCompSelectionAndRef);
}

exports.activate = activate;
