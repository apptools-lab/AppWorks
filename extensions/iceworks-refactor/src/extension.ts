import { ExtensionContext, commands } from 'vscode';
import { initExtension } from '@iceworks/common-service';
import { removeCompAndRef, removeCompSnippetAndRef } from './commands';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  commands.registerCommand('iceworks-refactor.component.dir-and-reference.remove', removeCompAndRef);
  commands.registerTextEditorCommand('iceworks-refactor.component.snippet-and-reference.remove', removeCompSnippetAndRef);
}

exports.activate = activate;
