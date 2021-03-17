import { ExtensionContext, commands, TextEditor, window } from 'vscode';
import { initExtension } from '@iceworks/common-service';

function activate(context: ExtensionContext) {
  // auto set configuration
  initExtension(context);

  const deleteCodeAndReferenceCommand = commands.registerTextEditorCommand(
    'iceworks-refactor.delete',
    (textEditor: TextEditor) => {
      const { document, selection } = textEditor;
      const word = document.getText(selection);

      console.log(word);

      window.showInformationMessage(word);
    },
  );

  context.subscriptions.push(deleteCodeAndReferenceCommand);
}

exports.activate = activate;
