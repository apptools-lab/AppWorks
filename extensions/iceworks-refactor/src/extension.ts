import { ExtensionContext, commands } from 'vscode';
import { initExtension } from '@iceworks/common-service';
import removeComponentAndReference from './commands/removeComponentAndReference';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  commands.registerCommand('iceworks-refactor.component.remove', removeComponentAndReference);
}

exports.activate = activate;
