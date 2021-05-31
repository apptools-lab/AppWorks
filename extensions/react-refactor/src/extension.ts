import { ExtensionContext, commands } from 'vscode';
import { initExtension } from '@appworks/common-service';
import { removeCompAndRef, removeCompSelectionAndRef } from './commands';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  commands.registerCommand('react-refactor.file-and-reference.remove', removeCompAndRef);
  commands.registerTextEditorCommand('react-refactor.selection-and-reference.remove', removeCompSelectionAndRef);
}

exports.activate = activate;
