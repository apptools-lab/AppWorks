import * as vscode from 'vscode';

interface IConfig {
  [key: string]: {
    docs: string;
    title: string;
    title_en: string;
    message: string;
    message_en: string;
    name: string;
    version: string;
    transform: string;
  };
}

let decorationType;
function getDecorationType(): vscode.TextEditorDecorationType {
  // Remove last decoration first
  decorationType && decorationType.dispose();
  decorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'line-through',
  });
  return decorationType;
}

export default function (deprecatedPackageConfig: IConfig) {
  const isEn = vscode.env.language === 'en';
  const editor = vscode.window.activeTextEditor;

  if (!editor || Object.keys(deprecatedPackageConfig).length === 0) return;

  const text = editor.document.getText();
  const decorationsArray: vscode.DecorationOptions[] = [];

  let matched;
  const reg = new RegExp(Object.keys(deprecatedPackageConfig).map((key) => `(["|'|\`]${key}["|'|\`])`).join('|'), 'g');

  // eslint-disable-next-line
  while (matched = reg.exec(text || '')) {

    const config = deprecatedPackageConfig[matched[0].slice(1, -1)];
    if (config) {
      const start = editor.document.positionAt(matched.index);
      const end = editor.document.positionAt(matched.index + matched[0].length);

      const range = new vscode.Range(start, end);
      const hoverMessage = new vscode.MarkdownString(
        `# ${isEn ? 'Codemod Suggestion' : 'Codemod 建议'}  \n  ` +
        `${isEn ? config.title_en : config.title}: ${isEn ? config.message_en : config.message} ` +
        `( [${isEn ? 'docs' : '文档'}](${config.docs}) )  \n\n  ` +
        `[Run a Codemod](${vscode.Uri.parse(
          `command:doctor.codemod?${encodeURIComponent(JSON.stringify([{ transform: config.transform }]))}`,
        )})`,
      );
      hoverMessage.isTrusted = true;

      decorationsArray.push({
        range,
        hoverMessage,
      });
    }
  }

  editor.setDecorations(getDecorationType(), decorationsArray);
}
