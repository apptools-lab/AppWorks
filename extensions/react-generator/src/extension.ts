import { ExtensionContext } from 'vscode';
import { initExtension, registerCommand } from '@appworks/common-service';
import autoFillContent from './autoFillContent';
import addDarkModeMediaQuery from './addDarkModeMediaQuery/index';
import jsonToTsInterface from './jsonToTsInterface/index';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  registerCommand('react-generator.css-add-dark-mode-media-query', addDarkModeMediaQuery);
  registerCommand('react-generator.json-to-ts-interface', jsonToTsInterface);

  autoFillContent();
}

exports.activate = activate;
