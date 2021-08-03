import { ExtensionContext } from 'vscode';
import { initExtension } from '@appworks/common-service';
import autoFillContent from './autoFillContent';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  autoFillContent();
}

exports.activate = activate;
